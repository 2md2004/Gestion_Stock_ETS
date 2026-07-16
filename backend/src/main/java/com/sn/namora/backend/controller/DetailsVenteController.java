package com.sn.namora.backend.controller;

import com.sn.namora.backend.dto.request.DetailsVenteRequest;
import com.sn.namora.backend.model.DetailsVente;
import com.sn.namora.backend.service.DetailsVenteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ventes/details")
public class DetailsVenteController {
    private final DetailsVenteService detailsVenteService;

    @PostMapping
    public ResponseEntity<DetailsVente> saveDetailsVente(@RequestBody DetailsVenteRequest detailsVente) {
        return new ResponseEntity<>(detailsVenteService.createDetailsVente(detailsVente), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<DetailsVente>> findAllDetailsVente() {
        return new ResponseEntity<>(detailsVenteService.findAllDetailsVente(), HttpStatus.OK);
    }
}
