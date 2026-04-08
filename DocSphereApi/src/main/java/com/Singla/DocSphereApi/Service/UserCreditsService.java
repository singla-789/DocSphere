package com.Singla.DocSphereApi.Service;


import com.Singla.DocSphereApi.Document.UserCredits;
import com.Singla.DocSphereApi.Repository.UserCreditsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserCreditsService {

    private final UserCreditsRepository userCreditsRepository;
    private final ProfileService profileService;

    public UserCredits createInitialCredits(String clerkId){
        UserCredits userCredits = UserCredits.builder()
                .clerkId(clerkId)
                .credits(5)
                .plan("basic")
                .build();
        return userCreditsRepository.save(userCredits);
    }

    public UserCredits getUserCredits(String clerkId){
        return userCreditsRepository.findByClerkId(clerkId)
                .orElseGet(()-> createInitialCredits(clerkId));
    }

    public UserCredits getuserCredits(){
        String clerkId = profileService.getCurrentProfile().getClerkId();
        return getUserCredits(clerkId);
    }

    public boolean hasEnoughCredits(int requiredCred){
        UserCredits currUserCredits = getuserCredits();
        return currUserCredits.getCredits()>=requiredCred;
    }

    public UserCredits consumeCredit() {
        UserCredits userCredits = getuserCredits();
        if (userCredits.getCredits() <= 0) {
            return null;
        }
        userCredits.setCredits(userCredits.getCredits() - 1);
        return userCreditsRepository.save(userCredits);
    }

    public UserCredits addCredits(String clerkId,Integer creditsToAdd,String plan){
        UserCredits userCredits = userCreditsRepository.findByClerkId(clerkId)
                .orElseGet(() -> createInitialCredits(clerkId));
        userCredits.setCredits(userCredits.getCredits()+creditsToAdd);
        userCredits.setPlan(plan);
        return userCreditsRepository.save(userCredits);
    }

    public boolean existsByClerkId(String clerkId) {
        return userCreditsRepository.existsByClerkId(clerkId);
    }
    public void deleteCredits(String clerkId) {
        userCreditsRepository.deleteByClerkId(clerkId);
    }
}
