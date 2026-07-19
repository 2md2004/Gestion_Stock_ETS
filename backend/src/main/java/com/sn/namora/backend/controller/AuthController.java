package com.sn.namora.backend.controller;

import com.sn.namora.backend.dto.request.ChangePasswordRequest;
import com.sn.namora.backend.dto.request.LoginRequest;
import com.sn.namora.backend.dto.request.ForgotRequest;
import com.sn.namora.backend.dto.request.ResetPasswordRequest;
import com.sn.namora.backend.dto.response.LoginResponse;
import com.sn.namora.backend.exceptions.TokenExpiredException;
import com.sn.namora.backend.model.RefreshToken;
import com.sn.namora.backend.model.Utilisateur;
import com.sn.namora.backend.service.JwtService;
import com.sn.namora.backend.service.RefreshTokenService;
import com.sn.namora.backend.service.ResetTokenService;
import com.sn.namora.backend.service.UtilisateurService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final ResetTokenService resetTokenService;
    private final UtilisateurService utilisateurService;
    private final RefreshTokenService refreshTokenService; // ✅ ajouté

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getMotDePasse()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Utilisateur utilisateur = utilisateurService.getUtilisateurByEmail(loginRequest.getEmail())
                .orElseThrow();

        String access_token = jwtService.getToken(loginRequest.getEmail());

        RefreshToken refreshToken = refreshTokenService.getRefreshToken(loginRequest.getEmail());

        ResponseCookie accessCookie = ResponseCookie.from("access_token", access_token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofMinutes(15))
                .sameSite("Strict")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", refreshToken.getToken())
                .httpOnly(true)
                .secure(false)
                .path("/refresh-token") // ✅ n'est envoyé que sur cette route
                .maxAge(Duration.ofDays(7))
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        LoginResponse loginResponse = new LoginResponse(
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.getRole().name()
        );

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(
            @CookieValue(name = "refresh_token", required = false) String token,
            HttpServletResponse response) {
        System.out.println("Called method");
        if (token == null) {
            return ResponseEntity.status(401).body("Refresh token manquant");
        }

        try {
            RefreshToken refreshToken = refreshTokenService.findByToken(token);
            String newAccessToken = refreshTokenService.generateNewToken(refreshToken);

            ResponseCookie accessCookie = ResponseCookie.from("access_token", newAccessToken)
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(Duration.ofMinutes(15))
                    .sameSite("Strict")
                    .build();

            response.setHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

            return ResponseEntity.ok().build();

        } catch (TokenExpiredException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(Authentication authentication, HttpServletResponse response) {
        if (authentication != null && authentication.isAuthenticated()) {
            refreshTokenService.revokeToken(authentication.getName()); // ✅ révoque sans recréer
        }

        ResponseCookie accessCookie = ResponseCookie.from("access_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from("refresh_token", "")
                .httpOnly(true)
                .secure(false)
                .path("/refresh-token")
                .maxAge(0)
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());
        response.addHeader(HttpHeaders.SET_COOKIE, refreshCookie.toString());

        return ResponseEntity.ok("Déconnexion réussie");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotRequest forgotRequest) {
        resetTokenService.forgotPassword(forgotRequest.getEmail());
        return ResponseEntity.ok("Un email de réinitialisation a été envoyé à cette adresse");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest resetPasswordRequest) {
        resetTokenService.resetPassword(resetPasswordRequest.getToken(), resetPasswordRequest.getPassword());
        return ResponseEntity.ok("Mot de passe changé");
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        utilisateurService.changePassword(changePasswordRequest);
        return ResponseEntity.ok("Mot de passe changé");
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).build();
        }

        Utilisateur utilisateur = utilisateurService.getUtilisateurByEmail(authentication.getName())
                .orElseThrow();

        LoginResponse loginResponse = new LoginResponse(
                utilisateur.getId(),
                utilisateur.getNom(),
                utilisateur.getPrenom(),
                utilisateur.getEmail(),
                utilisateur.getRole().name()
        );

        return ResponseEntity.ok(loginResponse);
    }
}