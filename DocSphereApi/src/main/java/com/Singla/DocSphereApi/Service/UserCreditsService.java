package com.Singla.DocSphereApi.Service;


import com.Singla.DocSphereApi.Document.UserCredits;
import com.Singla.DocSphereApi.Repository.UserCreditsRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreditsService {

    private final UserCreditsRepository userCreditsRepository;

    public UserCredits createInitialCredits(String clerkId){
        UserCredits userCredits = UserCredits.builder()
                .clerkId(clerkId)
                .credits(5)
                .plan("basic")
                .build();
        return userCreditsRepository.save(userCredits);
    }

    public boolean existsByClerkId(String clerkId) {
        return userCreditsRepository.existsByClerkId(clerkId);
    }
    public void deleteCredits(String clerkId) {
        userCreditsRepository.deleteByClerkId(clerkId);
    }
}
