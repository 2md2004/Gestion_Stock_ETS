package com.sn.namora.backend.dto.response;

import com.sn.namora.backend.enums.Etat;
import com.sn.namora.backend.enums.Role;
import com.sn.namora.backend.enums.Sexe;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UtilisateurResponse {
    private String id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private Sexe sexe;
    private Role role;
    private Etat etat;
    private LocalDate dateDeCreation;
}
