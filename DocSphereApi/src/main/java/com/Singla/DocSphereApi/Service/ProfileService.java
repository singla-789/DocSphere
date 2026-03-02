package com.Singla.DocSphereApi.Service;

import com.Singla.DocSphereApi.DTO.ProfileDto;
import com.Singla.DocSphereApi.Document.ProfileDocument;
import com.Singla.DocSphereApi.Repository.ProfileRepository;
import com.mongodb.DuplicateKeyException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final MongoTemplate mongoTemplate;

    public ProfileDto createProfile(ProfileDto dto){
//        System.out.println("SERVICE HIT");
//        System.out.println("Connected DB: " + mongoTemplate.getDb().getName());

        if(profileRepository.existsByClerkId(dto.getClerkId())){
            return updateProfile(dto);
        }

        ProfileDocument profile = ProfileDocument.builder()
                .clerkId(dto.getClerkId())
                .email(dto.getEmail())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .photoUrl(dto.getPhotoUrl())
                .credits(5)
                .createdAt(Instant.now())
                .build();

        ProfileDocument saved =  profileRepository.save(profile);
        System.out.println("Saved ID: " + saved.getId());

        return toDto(profile);
    }

    public ProfileDto toDto(ProfileDocument profile){
        return ProfileDto.builder()
                .id(profile.getId())
                .clerkId(profile.getClerkId())
                .email(profile.getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .photoUrl(profile.getPhotoUrl())
                .credits(profile.getCredits())
                .createdAt(profile.getCreatedAt())
                .build();
    }

    public ProfileDto updateProfile(ProfileDto profileDTO){
        ProfileDocument existingProfile = profileRepository.findByClerkId(profileDTO.getClerkId());
        if (existingProfile != null) {
            //update fields if provided
            if (profileDTO.getEmail() != null && !profileDTO.getEmail().isEmpty()) {
                existingProfile.setEmail(profileDTO.getEmail());
            }
            if (profileDTO.getFirstName() != null && !profileDTO.getFirstName().isEmpty()) {
                existingProfile.setFirstName(profileDTO.getFirstName());
            }
            if (profileDTO.getLastName() != null && !profileDTO.getLastName().isEmpty()) {
                existingProfile.setLastName(profileDTO.getLastName());
            }
            if (profileDTO.getPhotoUrl() != null && !profileDTO.getPhotoUrl().isEmpty()) {
                existingProfile.setPhotoUrl(profileDTO.getPhotoUrl());
            }
            profileRepository.save(existingProfile);
            return toDto(existingProfile);
        }
        return  null;
    }

    public boolean existByClerkId(String clerkId){
        return profileRepository.existsByClerkId(clerkId);
    }

    public void deleteProfile(String clerkId){
        ProfileDocument profile = profileRepository.findByClerkId(clerkId);
        if(profile!=null){
            profileRepository.delete(profile);
        }
    }



}
