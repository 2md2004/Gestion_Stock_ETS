package com.sn.namora.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProduitRequest {
    private String nom;
    private String description;
    private BigDecimal prixAchat;
    private BigDecimal prixVente;
    private int quantite;
    private Long categorieId;

}
