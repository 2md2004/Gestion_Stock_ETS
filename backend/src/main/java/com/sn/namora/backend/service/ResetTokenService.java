package com.sn.namora.backend.service;

import com.sn.namora.backend.exceptions.ResetTokenExpiredException;
import com.sn.namora.backend.exceptions.ResetTokenInvalidException;
import com.sn.namora.backend.model.ResetToken;
import com.sn.namora.backend.model.Utilisateur;
import com.sn.namora.backend.repository.ResetTokenRepository;
import com.sn.namora.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResetTokenService {
    private final ResetTokenRepository resetTokenRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Transactional
    public void forgotPassword(String email) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findByEmail(email);

        if (utilisateurOptional.isPresent()) {
            Utilisateur utilisateur = utilisateurOptional.get();

            resetTokenRepository.deleteByUtilisateur(utilisateur);
            resetTokenRepository.flush();

            ResetToken resetToken = new ResetToken();
            resetToken.setToken(UUID.randomUUID().toString());
            resetToken.setUtilisateur(utilisateur);
            resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(15));

            resetTokenRepository.save(resetToken);

            String lien = "http://localhost:5173/reinitialiser-mot-de-passe?token=" + resetToken.getToken();
            System.out.println(lien);
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        Optional<ResetToken> tokenOptional = resetTokenRepository.findByToken(token);

        if (tokenOptional.isPresent()) {
            ResetToken resetToken = tokenOptional.get();

            if (!isTokenExpired(resetToken)) {
                Utilisateur utilisateur = resetToken.getUtilisateur();
                utilisateur.setMotDePasse(bCryptPasswordEncoder.encode(newPassword));
                utilisateurRepository.save(utilisateur);
                resetTokenRepository.delete(resetToken);
            } else {
                resetTokenRepository.delete(resetToken);
                throw new ResetTokenExpiredException("Le lien de réinitialisation est expiré");
            }
        } else {
            throw new ResetTokenInvalidException("Le lien n'est pas valide");
        }
    }

    public boolean isTokenExpired(ResetToken resetToken) {
        return LocalDateTime.now().isAfter(resetToken.getExpiresAt());
    }
}