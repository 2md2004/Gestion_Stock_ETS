package com.sn.namora.backend.service;

import com.sn.namora.backend.dto.request.ChangePasswordRequest;
import com.sn.namora.backend.enums.Etat;
import com.sn.namora.backend.enums.Role;
import com.sn.namora.backend.exceptions.EmailAlreadyExistsException;
import com.sn.namora.backend.exceptions.IncorrectPasswordException;
import com.sn.namora.backend.exceptions.TelephoneAlreadyExistsException;
import com.sn.namora.backend.exceptions.UtilisateurNotFoundException;
import com.sn.namora.backend.model.Utilisateur;
import com.sn.namora.backend.repository.UtilisateurRepository;
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
    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        if (utilisateurRepository.findByEmail(utilisateur.getEmail()).isPresent()) throw new EmailAlreadyExistsException("Cet email existe déjà");
        if (utilisateurRepository.findByTelephone(utilisateur.getTelephone()).isPresent()) throw new TelephoneAlreadyExistsException("Ce numéro de téléphone existe déjà");
        utilisateur.setId(UUID.randomUUID().toString().substring(0,8));
        utilisateur.setDateDeCreation(LocalDate.now());
        utilisateur.setRole(Role.GERANT);
        utilisateur.setEtat(Etat.ACTIF);
        String password = UUID.randomUUID().toString().substring(0,8);
        System.out.println("Mot de passe :" + password);
        utilisateur.setMotDePasse(bCryptPasswordEncoder.encode(password));
        return utilisateurRepository.save(utilisateur);
    }

    public Optional<Utilisateur> getUtilisateurById(String id) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        if  (utilisateurOptional.isPresent()) {
            return utilisateurRepository.findById(id);
        }
        else throw new UtilisateurNotFoundException("Utilisateur introuvable");
    }
    public Optional<Utilisateur> getUtilisateurByEmail(String email) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findByEmail(email);
        if  (utilisateurOptional.isPresent()) {
            return utilisateurRepository.findByEmail(email);
        }
        else throw new UtilisateurNotFoundException("Utilisateur introuvable");
    }

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();
    }
    public List<Utilisateur> getAllGerant(){
        return utilisateurRepository.findByRole(Role.GERANT);
    }
    public List<Utilisateur> getAllUtilisateursByEtat(Etat etat){
        return utilisateurRepository.findByEtat(etat);
    }
    public void deleteUtilisateurById(String id) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        if (utilisateurOptional.isPresent()) {
            utilisateurRepository.deleteById(id);
        }
        else throw new UtilisateurNotFoundException("Utilisateur introuvable");
    }

    public Utilisateur updateUtilisateur(String id,Utilisateur utilisateur) {
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
            return utilisateurRepository.save(old);
        }
        else throw new UtilisateurNotFoundException("Utilisateur introuvable");
    }

    public Utilisateur enableUtilisateur(String id) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        if (utilisateurOptional.isPresent()) {
            Utilisateur old = utilisateurOptional.get();
            old.setEtat(Etat.ACTIF);
            return utilisateurRepository.save(old);
        }
        else throw new UtilisateurNotFoundException("Utilisateur introuvable");
    }

    public Utilisateur disableUtilisateur(String id) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        if (utilisateurOptional.isPresent()) {
            Utilisateur old = utilisateurOptional.get();
            old.setEtat(Etat.INACTIF);
            return utilisateurRepository.save(old);
        }
        else throw new UtilisateurNotFoundException("Utilisateur introuvable");
    }

    public Utilisateur archiveUtilisateur(String id) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        if (utilisateurOptional.isPresent()) {
            Utilisateur old = utilisateurOptional.get();
            old.setEtat(Etat.ARCHIVE);
            return utilisateurRepository.save(old);
        }
        else throw new UtilisateurNotFoundException("Utilisateur introuvable");
    }

    public void changePassword(String id , String oldPassword, String newPassword) {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        if (utilisateurOptional.isPresent()) {
            Utilisateur old = utilisateurOptional.get();
            if (!bCryptPasswordEncoder.matches(oldPassword,old.getMotDePasse())) throw new IncorrectPasswordException("Mot de passe incorrect");
            old.setMotDePasse(bCryptPasswordEncoder.encode(newPassword));
            utilisateurRepository.save(old);
        }
        else throw new UtilisateurNotFoundException("Utilisateur introuvable");
    }



}
