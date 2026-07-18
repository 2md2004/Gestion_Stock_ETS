package com.sn.namora.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetailsVenteRequest {
    private String idProduit;
    private String idVente;
    private int quantiteVendu;
    private boolean nouveauProduit;
    private String nomNouveauProduit;
    private Long categorieId;
    private BigDecimal prixAchat;
    private BigDecimal prixVente;
    private int stockInitial;
}
