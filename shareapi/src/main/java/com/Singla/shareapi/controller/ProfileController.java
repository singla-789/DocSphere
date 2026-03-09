package com.Singla.shareapi.controller;

import com.Singla.shareapi.DTO.ProfileDto;
import com.Singla.shareapi.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    @Autowired
    private ProfileService profileService;

    @PostMapping("/register")
    public ResponseEntity<?> registerProfile(@RequestBody ProfileDto dto){
        System.out.println("hello i am controlller");
        ProfileDto newDto = profileService.createProfile(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(newDto);
    }

}
