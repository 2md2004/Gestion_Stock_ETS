package com.sn.namora.backend.service;

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
public class UserDetailsServiiceImpl implements UserDetailsService {
    private final UtilisateurRepository utilisateurRepository;
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findByEmail(email);
        if (utilisateurOptional.isPresent()) {
            return User
                    .builder()
                    .username(utilisateurOptional.get().getEmail())
                    .password(utilisateurOptional.get().getMotDePasse())
                    .roles(utilisateurOptional.get().getRole().toString())
                    .build();
        }
        else  {
            throw new UsernameNotFoundException("User not found");
        }
    }
}
