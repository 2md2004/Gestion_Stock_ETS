package com.sn.namora.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VenteRequest {
    private LocalDate date;
    private List<DetailsVenteRequest> detailsVenteRequests;
}
