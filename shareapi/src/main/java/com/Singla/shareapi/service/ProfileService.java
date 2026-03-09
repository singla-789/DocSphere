package com.Singla.shareapi.service;

import com.Singla.shareapi.DTO.ProfileDto;
import com.Singla.shareapi.document.ProfileDocument;
import com.Singla.shareapi.repository.ProfileRepository;
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
        System.out.println("SERVICE HIT");
        System.out.println("Connected DB: " + mongoTemplate.getDb().getName());
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

}
