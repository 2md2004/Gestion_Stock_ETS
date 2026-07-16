package com.sn.namora.backend.repository;

import com.sn.namora.backend.model.ResetToken;
import com.sn.namora.backend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ResetTokenRepository extends JpaRepository<ResetToken, Long> {
   Optional<ResetToken> findByToken(String token);
   void deleteByUtilisateur(Utilisateur utilisateur);
   long countByUtilisateur(Utilisateur utilisateur);
}
