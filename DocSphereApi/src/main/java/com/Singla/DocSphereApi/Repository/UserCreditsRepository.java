package com.Singla.DocSphereApi.Repository;

import com.Singla.DocSphereApi.Document.UserCredits;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserCreditsRepository extends MongoRepository<UserCredits,String> {
    boolean existsByClerkId(String clerkId);
    void deleteByClerkId(String clerkId);
}
