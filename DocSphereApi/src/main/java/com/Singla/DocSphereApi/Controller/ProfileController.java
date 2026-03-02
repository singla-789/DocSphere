package com.Singla.DocSphereApi.Controller;

import com.Singla.DocSphereApi.DTO.ProfileDto;
import com.Singla.DocSphereApi.Service.ProfileService;
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
        HttpStatus status = profileService.existByClerkId(dto.getClerkId()) ? HttpStatus.OK : HttpStatus.CREATED ;
        ProfileDto newDto = profileService.createProfile(dto);
        return ResponseEntity.status(status).body(newDto);
    }

}
