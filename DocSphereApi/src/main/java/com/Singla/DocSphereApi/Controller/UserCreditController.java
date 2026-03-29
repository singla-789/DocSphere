package com.Singla.DocSphereApi.Controller;

import com.Singla.DocSphereApi.DTO.UserCreditsDto;
import com.Singla.DocSphereApi.Document.UserCredits;
import com.Singla.DocSphereApi.Service.UserCreditsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserCreditController {

    private final UserCreditsService userCreditsService;

    @GetMapping("/credits")
    public ResponseEntity<?> getUserCredits(){
        UserCredits userCredits = userCreditsService.getuserCredits();

        UserCreditsDto response = UserCreditsDto.builder()
                .credits(userCredits.getCredits())
                .plan(userCredits.getPlan())
                .build();

        return ResponseEntity.ok(response);
    }
}
