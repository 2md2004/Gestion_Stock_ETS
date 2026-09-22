package com.sn.namora.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetailsVenteResponse {
    private String produitId;
    private String nomProduit;
    private int quantiteVendu;
    private int prixUnitaireVente;
    private int total;
}
