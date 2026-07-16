package com.sn.namora.backend.controller;

import com.sn.namora.backend.dto.RapportVenteResponse;
import com.sn.namora.backend.service.VenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/ventes")
@RequiredArgsConstructor
public class VenteController {

    private final VenteService venteService;

    @GetMapping("/rapport")
    public ResponseEntity<RapportVenteResponse> getRapport(
            @RequestParam String type,
            @RequestParam(required = false) String date
    ) {
        LocalDate dateReference = (date != null) ? LocalDate.parse(date) : LocalDate.now();
        return ResponseEntity.ok(venteService.genererRapport(type, dateReference));
    }
}