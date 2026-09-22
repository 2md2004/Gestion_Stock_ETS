package com.sn.namora.backend.controller;

import com.sn.namora.backend.dto.RapportVenteResponse;
import com.sn.namora.backend.dto.request.VenteRequest;
import com.sn.namora.backend.dto.response.VenteResponse;
import com.sn.namora.backend.model.Vente;
import com.sn.namora.backend.service.VenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/ventes")
@RequiredArgsConstructor
public class VenteController {

    private final VenteService venteService;

    @PostMapping
    public ResponseEntity<Vente> addVente(@RequestBody VenteRequest vente) {
        return new ResponseEntity<>(
                venteService.createVenteWithDetails(vente),
                HttpStatus.CREATED
        );
    }

    // Liste paginée des ventes
    @GetMapping
    public ResponseEntity<Page<VenteResponse>> findAllVentes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(required = false) String debut,
            @RequestParam(required = false) String fin
    ) {
        LocalDate d = (debut != null && !debut.isBlank()) ? LocalDate.parse(debut) : null;
        LocalDate f = (fin != null && !fin.isBlank()) ? LocalDate.parse(fin) : null;

        return new ResponseEntity<>(
                venteService.findAllVentes(page, size, sortBy, d, f),
                HttpStatus.OK
        );
    }

    // Recherche d'une vente par ID
    @GetMapping("/{id}")
    public ResponseEntity<VenteResponse> getVenteById(
            @PathVariable String id
    ) {
        return new ResponseEntity<>(
                venteService.findById(id),
                HttpStatus.OK
        );
    }

    // Suppression d'une vente
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVente(
            @PathVariable String id
    ) {
        venteService.deleteVente(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Génération du rapport des ventes
    @GetMapping("/rapport")
    public ResponseEntity<RapportVenteResponse> getRapport(
            @RequestParam String type,
            @RequestParam(required = false) String date
    ) {
        LocalDate dateReference = (date != null)
                ? LocalDate.parse(date)
                : LocalDate.now();

        return ResponseEntity.ok(
                venteService.genererRapport(type, dateReference)
        );
    }
    @GetMapping("/search")
    public ResponseEntity<List<VenteResponse>> rechercherVentes(
            @RequestParam("q") String query
    ) {
        return ResponseEntity.ok(venteService.rechercherVentes(query));
    }
}