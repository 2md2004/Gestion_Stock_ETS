package com.sn.namora.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VenteRequest {
    private LocalDate date;
    private Long clientId;
    private List<DetailsVenteRequest> detailsVenteRequests;
}
