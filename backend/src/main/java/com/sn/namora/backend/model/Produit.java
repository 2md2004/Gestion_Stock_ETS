package com.sn.namora.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Produit {
    @Id
    private String id;
    @Column(length = 30)
    private String nom;
    @Column(length = 255)
    private String description;
    private BigDecimal prixAchat;
    private BigDecimal prixVente;
    private int quantite;
    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;
}
