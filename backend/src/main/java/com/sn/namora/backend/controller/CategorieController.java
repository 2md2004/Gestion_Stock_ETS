package com.sn.namora.backend.controller;


import com.sn.namora.backend.model.Categorie;
import com.sn.namora.backend.service.CategorieService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
public class CategorieController {
    private final CategorieService categorieService;

    @PostMapping
    public ResponseEntity<Categorie> createCategorie(@RequestBody Categorie categorie) {
        return new ResponseEntity<>(categorieService.createCategorie(categorie), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Categorie>> getAllCategorie() {
        return new ResponseEntity<>(categorieService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/nom/{nom}")
    public ResponseEntity<Optional<Categorie>> getCategorieByNom(@PathVariable String nom) {
        return new ResponseEntity<>(categorieService.findByNom(nom), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Categorie>> getCategorieById(@PathVariable Long id) {
        return new ResponseEntity<>(categorieService.findById(id), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategorie(@PathVariable Long id) {
        categorieService.deleteCategorie(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categorie> updateCategorie(@PathVariable Long id, @RequestBody Categorie categorie) {
        return new ResponseEntity<>(categorieService.updateCategorie(id,categorie),HttpStatus.OK);
    }
}
