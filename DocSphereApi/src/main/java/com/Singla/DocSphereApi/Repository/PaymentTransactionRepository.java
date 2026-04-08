package com.Singla.DocSphereApi.Repository;


import com.Singla.DocSphereApi.Document.PaymentTransaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PaymentTransactionRepository extends MongoRepository<PaymentTransaction,String> {
    List<PaymentTransaction> findByClerkId(String clerkId);
    List<PaymentTransaction> findByClerkIdOrderByTransactionDateDesc(String clerkId);
    List<PaymentTransaction> findByClerkIdAndStatusOrderByTransactionDateDesc(String clerkId,String status);
}
