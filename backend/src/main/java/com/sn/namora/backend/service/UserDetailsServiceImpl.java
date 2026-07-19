package com.sn.namora.backend.service;

import com.sn.namora.backend.enums.Etat;
import com.sn.namora.backend.exceptions.UtilisateurNotFoundException;
import com.sn.namora.backend.exceptions.UtilitisateurNotActifException;
import com.sn.namora.backend.model.Utilisateur;
import com.sn.namora.backend.repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UtilisateurRepository utilisateurRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findByEmail(email);
        if (utilisateurOptional.isPresent()) {
            Utilisateur utilisateur = utilisateurOptional.get();
            if (utilisateur.getEtat() != Etat.ACTIF) {
                throw new UtilitisateurNotActifException("Compte non actif, veuillez contacter l'administrateur");
            }
            return User
                    .builder()
                    .username(utilisateurOptional.get().getEmail())
                    .password(utilisateurOptional.get().getMotDePasse())
                    .roles(utilisateurOptional.get().getRole().toString())
                    .build();
        }
        else  {
            throw new UtilisateurNotFoundException("Utilisateur introuvable");
        }
    }
}
