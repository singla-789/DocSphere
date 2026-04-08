package com.Singla.DocSphereApi.Service;

import com.Singla.DocSphereApi.DTO.PaymentDto;
import com.Singla.DocSphereApi.DTO.PaymentVerificationDto;
import com.Singla.DocSphereApi.Document.PaymentTransaction;
import com.Singla.DocSphereApi.Document.ProfileDocument;
import com.Singla.DocSphereApi.Repository.PaymentTransactionRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Formatter;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ProfileService profileService;
    private final UserCreditsService userCreditsService;
    private final PaymentTransactionRepository paymentTransactionRepository;


    @Value("${razorpay.key.id}")
    private String razorpayKeyId;
    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentDto createOrder(PaymentDto paymentDto){
        try{
            ProfileDocument currProfile = profileService.getCurrentProfile();
            String clerkId = currProfile.getClerkId();
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId,razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount",paymentDto.getAmount());
            orderRequest.put("currency",paymentDto.getCurrency());
            orderRequest.put("receipt","order_"+System.currentTimeMillis());

            Order order = razorpayClient.orders.create(orderRequest);
            String orderId = order.get("id");

//            create pending transaction record
            PaymentTransaction transaction = PaymentTransaction.builder()
                    .clerkId(clerkId)
                    .orderId(orderId)
                    .planId(paymentDto.getPlanId())
                    .amount(paymentDto.getAmount())
                    .status("PENDING")
                    .transactionDate(LocalDateTime.now())
                    .userEmail(currProfile.getEmail())
                    .userName(currProfile.getFirstName()+" "+currProfile.getLastName())
                    .build();

            paymentTransactionRepository.save(transaction);

            return PaymentDto.builder()
                    .orderId(orderId)
                    .success(true)
                    .message("Order created successfully")
                    .build();

        } catch (Exception e) {
            return PaymentDto.builder()
                    .success(false)
                    .message("Error creating order: " + e.getMessage())
                    .build();
        }
    }


    public PaymentDto verifyPayment(PaymentVerificationDto request){
        try{
            ProfileDocument currProfile = profileService.getCurrentProfile();
            String clerkId = currProfile.getClerkId();
            String data = request.getRazorpay_order_id() +"|"+request.getRazorpay_payment_id();
            String generatedSignature = generateHmacSha256Signature(data,razorpayKeySecret);

            if(!generatedSignature.equals(request.getRazorpay_signature())){
                updateTransactionStatus(request.getRazorpay_order_id(),"FAILED",request.getRazorpay_payment_id(),null);
                return PaymentDto.builder()
                        .success(false)
                        .message("Payment signature verification failed")
                        .build();
            }

//            ADD credits base on client
            int creditsToAdd = 0;
            String plan = "Basic";

            switch(request.getPlanId()){
                case "premium":
                    creditsToAdd = 500;
                    plan = "PREMIUM";
                    break;
                case "ultimate":
                    creditsToAdd = 5000;
                    plan = "ULTIMATE";
                    break;
            }

            if(creditsToAdd>0){
                userCreditsService.addCredits(clerkId,creditsToAdd,plan);
                updateTransactionStatus(request.getRazorpay_order_id(),"SUCCESS",request.getRazorpay_payment_id(),creditsToAdd);
                return PaymentDto.builder()
                        .success(true)
                        .message("Payment verified and credits added successfully")
                        .credits(userCreditsService.getUserCredits(clerkId).getCredits())
                        .build();
            }else{
                updateTransactionStatus(request.getRazorpay_payment_id(),"FAILED",request.getRazorpay_order_id(),null);
                return PaymentDto.builder()
                        .success(false)
                        .message("Invalid plan selected")
                        .build();
            }

        } catch (Exception e) {
            try{
                updateTransactionStatus(request.getRazorpay_order_id(),"ERROR",request.getRazorpay_payment_id(),null);
            } catch (Exception ex) {
                throw new RuntimeException(ex);
            }
            return PaymentDto.builder()
                    .success(false)
                    .message("Error verifying payment:" + e.getMessage())
                    .build();
        }
    }

    private void updateTransactionStatus(String razorpayOrderId, String status, String razorpayPaymentId, Integer creditsToAdd) {
        paymentTransactionRepository.findAll().stream()
                .filter(t -> t.getOrderId() != null && t.getOrderId().equals(razorpayOrderId))
                .findFirst()
                .map(trasaction -> {
                    trasaction.setStatus(status);
                    trasaction.setPaymentId(razorpayPaymentId);
                    if(creditsToAdd != null){
                        trasaction.setCreditsAdded(creditsToAdd);
                    }
                    return paymentTransactionRepository.save(trasaction);
                })
                .orElse(null);
    }


    private String generateHmacSha256Signature(String data, String secret)
            throws NoSuchAlgorithmException, InvalidKeyException {

        SecretKeySpec secretKey = new SecretKeySpec(secret.getBytes(), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(secretKey);

        byte[] hmacData = mac.doFinal(data.getBytes());

        return toHexString(hmacData);
    }


    private String toHexString(byte[] bytes) {
        Formatter formatter = new Formatter();
        for (byte b : bytes) {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }


    public java.util.List<PaymentTransaction> getUserTransactions() {
        ProfileDocument currProfile = profileService.getCurrentProfile();
        return paymentTransactionRepository.findByClerkIdOrderByTransactionDateDesc(currProfile.getClerkId());
    }

}
