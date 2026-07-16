package com.sn.namora.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RapportVenteResponse {
    private String typeRapport;
    private LocalDate dateDebut;
    private LocalDate dateFin;
    private BigDecimal totalVentes;
    private long nombreVentes;
    private BigDecimal venteMoyenne;
    private List<PointRapport> donneesGraphique;

    // Ces 3 champs restent vides tant que la relation Vente <-> Produit n'existe pas
    private String produitPlusVendu;
    private Integer quantiteProduitPlusVendu;
    private BigDecimal beneficeTotal;
}