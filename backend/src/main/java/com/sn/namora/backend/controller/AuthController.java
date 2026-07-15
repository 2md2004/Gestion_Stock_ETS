package com.sn.namora.backend.controller;

import com.sn.namora.backend.dto.request.LoginRequest;
import com.sn.namora.backend.dto.request.ResetRequest;
import com.sn.namora.backend.dto.response.LoginResponse;
import com.sn.namora.backend.service.JwtService;
import com.sn.namora.backend.service.ResetTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final ResetTokenService resetTokenService;
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getMotDePasse()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setAccessToken(jwtService.getToken(loginRequest.getEmail()));
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/forgot-password")
    public  ResponseEntity<String> forgotPassword(@RequestBody ResetRequest resetRequest) {
        resetTokenService.forgotPassword(resetRequest.getEmail());
        return ResponseEntity.ok("Un email de réinitialisation a été envoyé à cette adresse");

    }
    @PostMapping("/reset-password")
    public  ResponseEntity<String> resetPassword(@RequestParam String token , String newPassword) {
        resetTokenService.resetPassword(token, newPassword);
        return ResponseEntity.ok("Mot de passe changé");

    }
}
