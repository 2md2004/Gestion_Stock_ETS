package com.sn.namora.backend.controller;


import com.sn.namora.backend.dto.request.ProduitRequest;
import com.sn.namora.backend.model.Produit;
import com.sn.namora.backend.service.ProduitService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/produits")
@RequiredArgsConstructor
public class ProduitController {
    private final ProduitService produitService;
    @PostMapping
    public ResponseEntity<Produit> save(@RequestBody ProduitRequest produit ) {
        return new ResponseEntity<>(produitService.create(produit), HttpStatus.CREATED);
    }


    @GetMapping
    public ResponseEntity<Page<Produit>> findAllProduits(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "5") int size, @RequestParam(defaultValue = "nom") String sortBy) {
        return ResponseEntity.ok(produitService.findAllProduits(page, size, sortBy));
    }
    @GetMapping("/search")
    public ResponseEntity<List<Produit>> findByNomContaining(@RequestParam("q") String nom) {
        return new ResponseEntity<>(produitService.searchProduits(nom), HttpStatus.OK);
    }
    @GetMapping("/stock-faible")
    public ResponseEntity<Page<Produit>> getProduitsStockFaible(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "7") int size,
            @RequestParam(defaultValue = "nom") String sortBy) {
        return ResponseEntity.ok(produitService.findProduitsStockFaible(page, size, sortBy));
    }
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Produit>> getProduitById(@PathVariable String id) {
        return new ResponseEntity<>(produitService.findById(id),HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produit> updateProduit(@PathVariable String id,
                                                 @RequestBody ProduitRequest request) {
        return ResponseEntity.ok(produitService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduit(@PathVariable String id) {
        produitService.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }


}
