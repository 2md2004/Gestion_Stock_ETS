package com.sn.namora.backend.controller;

import com.sn.namora.backend.model.Boutique;
import com.sn.namora.backend.service.BoutiqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/boutique")
@RequiredArgsConstructor
public class BoutiqueController {

    private final BoutiqueService boutiqueService;

    @GetMapping
    public ResponseEntity<Boutique> getBoutique() {
        Optional<Boutique> boutique = boutiqueService.getBoutique();
        return boutique.map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(new Boutique()));
    }

    @PutMapping
    public ResponseEntity<Boutique> saveBoutique(@RequestBody Boutique boutique) {
        Boutique saved = boutiqueService.saveBoutique(boutique);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/logo")
    public ResponseEntity<?> uploadLogo(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Fichier vide"));
        }
        try {
            String filename = boutiqueService.uploadLogo(file);
            return ResponseEntity.ok(Map.of("filename", filename));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Erreur lors de l'upload"));
        }
    }
}
