package com.sn.namora.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Stats {
    private Long nbreProduits;
    private Long nbreCategories;
    private int stockFaible;
    private int nbreVentesDuJour;

}
