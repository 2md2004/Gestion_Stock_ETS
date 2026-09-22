package com.sn.namora.backend.service;

import com.sn.namora.backend.dto.response.UtilisateurResponse;
import com.sn.namora.backend.enums.Etat;
import com.sn.namora.backend.enums.Role;
import com.sn.namora.backend.exceptions.EmailAlreadyExistsException;
import com.sn.namora.backend.exceptions.IncorrectPasswordException;
import com.sn.namora.backend.exceptions.TelephoneAlreadyExistsException;
import com.sn.namora.backend.exceptions.UtilisateurNotFoundException;
import com.sn.namora.backend.mapper.UtilisateurMapper;
import com.sn.namora.backend.model.Utilisateur;
import com.sn.namora.backend.repository.UtilisateurRepository;
import com.sn.namora.backend.utils.PasswordGeneratorUtils;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UtilisateurService {
    private final UtilisateurRepository utilisateurRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final UtilisateurMapper utilisateurMapper;
    private final EmailService emailService;

    public UtilisateurResponse createUtilisateur(Utilisateur utilisateur) throws MessagingException {
        if (utilisateurRepository.findByEmail(utilisateur.getEmail()).isPresent())
            throw new EmailAlreadyExistsException("Cet email existe déjà");
        if (utilisateurRepository.findByTelephone(utilisateur.getTelephone()).isPresent())
            throw new TelephoneAlreadyExistsException("Ce numéro de téléphone existe déjà");

        utilisateur.setId(UUID.randomUUID().toString().substring(0, 8));
        utilisateur.setDateDeCreation(LocalDate.now());
        utilisateur.setRole(Role.GERANT);
        utilisateur.setEtat(Etat.ACTIF);

        String password = PasswordGeneratorUtils.generatePassword(8);
        System.out.println("Mot de passe :" + password);
        emailService.sendUserCredentialsEmail(utilisateur.getEmail(), utilisateur.getPrenom() + " " + utilisateur.getNom(), password);
        utilisateur.setMotDePasse(bCryptPasswordEncoder.encode(password));

        Utilisateur utilisateurCree = utilisateurRepository.save(utilisateur);
        return utilisateurMapper.toDto(utilisateurCree);
    }

    public UtilisateurResponse getUtilisateurById(String id) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        if (utilisateurOptional.isPresent()) {
            return utilisateurMapper.toDto(utilisateurOptional.get());
        } else {
            throw new UtilisateurNotFoundException("Utilisateur introuvable");
        }
    }

    public UtilisateurResponse getUtilisateurByEmail(String email) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findByEmail(email);
        if (utilisateurOptional.isPresent()) {
            return utilisateurMapper.toDto(utilisateurOptional.get());
        } else {
            throw new UtilisateurNotFoundException("Utilisateur introuvable");
        }
    }

    public List<UtilisateurResponse> getAllUtilisateurs() {
        return utilisateurMapper.toDto(utilisateurRepository.findAll());
    }

    public List<UtilisateurResponse> getAllGerant() {
        return utilisateurMapper.toDto(utilisateurRepository.findByRole(Role.GERANT));
    }

    public List<UtilisateurResponse> getAllUtilisateursByEtat(Etat etat) {
        return utilisateurMapper.toDto(utilisateurRepository.findByEtat(etat));
    }

    public void deleteUtilisateurById(String id) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        if (utilisateurOptional.isPresent()) {
            utilisateurRepository.deleteById(id);
        } else {
            throw new UtilisateurNotFoundException("Utilisateur introuvable");
        }
    }

    public UtilisateurResponse updateUtilisateur(String id, Utilisateur utilisateur) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        if (utilisateurOptional.isPresent()) {
            Utilisateur old = utilisateurOptional.get();
            old.setNom(utilisateur.getNom());
            old.setPrenom(utilisateur.getPrenom());
            old.setEmail(utilisateur.getEmail());
            old.setMotDePasse(utilisateur.getMotDePasse());
            old.setDateDeCreation(utilisateur.getDateDeCreation());
            old.setTelephone(utilisateur.getTelephone());
            old.setSexe(utilisateur.getSexe());
            old.setRole(utilisateur.getRole());
            old.setEtat(utilisateur.getEtat());

            Utilisateur miseAJour = utilisateurRepository.save(old);
            return utilisateurMapper.toDto(miseAJour);
        } else {
            throw new UtilisateurNotFoundException("Utilisateur introuvable");
        }
    }

    public UtilisateurResponse enableUtilisateur(String id) {
        return changerEtat(id, Etat.ACTIF);
    }

    public UtilisateurResponse disableUtilisateur(String id) {
        return changerEtat(id, Etat.INACTIF);
    }

    public UtilisateurResponse archiveUtilisateur(String id) {
        return changerEtat(id, Etat.ARCHIVE);
    }

    private UtilisateurResponse changerEtat(String id, Etat etat) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        if (utilisateurOptional.isPresent()) {
            Utilisateur old = utilisateurOptional.get();
            old.setEtat(etat);
            Utilisateur miseAJour = utilisateurRepository.save(old);
            return utilisateurMapper.toDto(miseAJour);
        } else {
            throw new UtilisateurNotFoundException("Utilisateur introuvable");
        }
    }

    public void changePassword(String id, String oldPassword, String newPassword) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        if (utilisateurOptional.isPresent()) {
            Utilisateur old = utilisateurOptional.get();
            if (!bCryptPasswordEncoder.matches(oldPassword, old.getMotDePasse()))
                throw new IncorrectPasswordException("Mot de passe incorrect");
            old.setMotDePasse(bCryptPasswordEncoder.encode(newPassword));
            utilisateurRepository.save(old);
        } else {
            throw new UtilisateurNotFoundException("Utilisateur introuvable");
        }
    }
}