package com.sn.namora.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VenteResponse {
    private String id;
    private LocalDate date;
    private BigDecimal montantTotal;
    private String nomClient;
    private String prenomClient;
    private List<DetailsVenteResponse> details;

}