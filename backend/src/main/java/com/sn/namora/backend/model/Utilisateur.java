package com.sn.namora.backend.model;

import com.sn.namora.backend.enums.Etat;
import com.sn.namora.backend.enums.Role;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Utilisateur {
    @Id
    private String id;
    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    @Enumerated(EnumType.STRING)
    private Role role;
    @Enumerated(EnumType.STRING)
    private Etat etat;
    private LocalDate dateDeCreation;
}
