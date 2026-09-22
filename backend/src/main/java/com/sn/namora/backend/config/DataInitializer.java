package com.sn.namora.backend.config;

import com.sn.namora.backend.enums.Etat;
import com.sn.namora.backend.enums.Role;
import com.sn.namora.backend.model.Utilisateur;
import com.sn.namora.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void run(String... args) {

        String email = "djibsonfall04@gmail.com";

        if (utilisateurRepository.findByEmail(email).isEmpty()) {

            Utilisateur utilisateur = new Utilisateur();

            utilisateur.setId(UUID.randomUUID().toString().substring(0, 8));
            utilisateur.setNom("FALL");
            utilisateur.setPrenom("DJIBY");
            utilisateur.setEmail(email);
            utilisateur.setTelephone("779830075");
            utilisateur.setDateDeCreation(LocalDate.now());
            utilisateur.setRole(Role.ADMIN);
            utilisateur.setEtat(Etat.ACTIF);

            String motDePasse = "admin";

            utilisateur.setMotDePasse(
                    bCryptPasswordEncoder.encode(motDePasse)
            );

            utilisateurRepository.save(utilisateur);

            System.out.println("==========================================");
            System.out.println("Utilisateur initial créé");
            System.out.println("Email : " + email);
            System.out.println("Mot de passe : " + motDePasse);
            System.out.println("Rôle : " + Role.GERANT);
            System.out.println("État : " + Etat.ACTIF);
            System.out.println("==========================================");

        } else {
            System.out.println(
                    "Utilisateur initial déjà existant : " + email
            );
        }
    }
}