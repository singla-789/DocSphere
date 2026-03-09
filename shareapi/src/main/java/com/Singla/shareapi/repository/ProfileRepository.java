package com.Singla.shareapi.repository;

import com.Singla.shareapi.document.ProfileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository

public interface ProfileRepository extends MongoRepository<ProfileDocument,String> {
    Optional<ProfileDocument> findByEmail(String email);
}
