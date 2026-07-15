package com.sn.namora.backend.service;

import com.sn.namora.backend.exceptions.UtilisateurNotFoundException;
import com.sn.namora.backend.model.Utilisateur;
import com.sn.namora.backend.repository.UtilisateurRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.*;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final UtilisateurRepository utilisateurRepository;
    @Value("${jwt.accessToken.expiration}")
    private Long accessTokenExpiration;

    @Value("${jwt.secret-key}")
    private String secretKey;

    public String getToken(String email) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findByEmail(email);
        if  (utilisateurOptional.isPresent()) {
            Utilisateur utilisateur = utilisateurOptional.get();
            Map<String, Object> claims = new HashMap<>();
            claims.put("id", utilisateur.getId());
            claims.put("role", utilisateur.getRole().name());
            claims.put("nom", utilisateur.getNom());
            claims.put("prenom", utilisateur.getPrenom());
            return Jwts.builder()
                    .subject(utilisateur.getEmail())
                    .claims(claims)
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                    .signWith(getSigningKey())
                    .compact();
        }
        else throw new UtilisateurNotFoundException("Utilisateur introuvable");
    }

    public String extractEmail(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
    public boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
        return expiration.before(new Date());
    }

    public boolean isTokenValid(String token,String email) {
        return !isTokenExpired(token) && extractEmail(token).equals(email);
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
