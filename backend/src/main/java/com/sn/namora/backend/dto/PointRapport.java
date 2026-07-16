package com.sn.namora.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PointRapport {
    private String label;       // ex: "Lundi", "12", "Janvier"
    private BigDecimal montant;
}