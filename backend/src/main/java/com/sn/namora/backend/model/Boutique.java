package com.sn.namora.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Boutique {
    @Id
    private String id;

    @Column(length = 100)
    private String nom;

    @Column(length = 50)
    private String ninea;

    @Column(length = 50)
    private String rccm;

    @Column(length = 30)
    private String telephone;

    @Column(length = 100)
    private String email;

    @Column(length = 255)
    private String adresse;

    @Column(length = 255)
    private String logoPath;
}
