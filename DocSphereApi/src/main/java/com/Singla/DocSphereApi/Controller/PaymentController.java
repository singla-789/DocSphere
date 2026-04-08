package com.Singla.DocSphereApi.Controller;

import com.Singla.DocSphereApi.DTO.PaymentDto;
import com.Singla.DocSphereApi.DTO.PaymentVerificationDto;
import com.Singla.DocSphereApi.Service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentDto paymentDto){
//        call service method to create the order
        PaymentDto response = paymentService.createOrder(paymentDto);

        if(response.getSuccess()){
            return ResponseEntity.ok(response);
        }else{
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayments(@RequestBody PaymentVerificationDto request){
       PaymentDto response = paymentService.verifyPayment(request);

       if(response.getSuccess()){
           return ResponseEntity.ok(response);
        }else{
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory(){
        return ResponseEntity.ok(paymentService.getUserTransactions());
    }
}
