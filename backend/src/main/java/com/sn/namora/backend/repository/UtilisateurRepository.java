package com.sn.namora.backend.repository;

import com.sn.namora.backend.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, String> {
    Optional<Utilisateur> findByEmail(String email);
}
