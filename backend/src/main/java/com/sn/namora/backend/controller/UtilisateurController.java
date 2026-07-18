package com.sn.namora.backend.controller;

import com.sn.namora.backend.dto.request.ChangePasswordRequest;
import com.sn.namora.backend.enums.Etat;
import com.sn.namora.backend.enums.Role;
import com.sn.namora.backend.model.Utilisateur;
import com.sn.namora.backend.service.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/gerants")
public class UtilisateurController {
    private final UtilisateurService utilisateurService;

    @PostMapping
    public ResponseEntity<Utilisateur> createUtilisateur(@RequestBody Utilisateur utilisateur) {
        return new ResponseEntity<>(utilisateurService.createUtilisateur(utilisateur), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAllUtilisateurs() {
        return new ResponseEntity<>(utilisateurService.getAllGerant(), HttpStatus.OK);
    }
    @GetMapping("/archives")
    public ResponseEntity<List<Utilisateur>> getAllUtilisateursArchive() {
        return new ResponseEntity<>(utilisateurService.getAllUtilisateursByEtat(Etat.ARCHIVE), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Utilisateur>> getUtilisateurById(@PathVariable String id) {
        return new ResponseEntity<>(utilisateurService.getUtilisateurById(id), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> updateUtilisateur(@PathVariable String id, @RequestBody Utilisateur utilisateur) {
        return new ResponseEntity<>(utilisateurService.updateUtilisateur(id, utilisateur), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable String id) {
        utilisateurService.deleteUtilisateurById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/activer/{id}")
    public ResponseEntity<Utilisateur> enableUtilisateur(@PathVariable String id) {
        return new ResponseEntity<>(utilisateurService.enableUtilisateur(id), HttpStatus.OK);
    }
    @PatchMapping("/desactiver/{id}")
    public ResponseEntity<Utilisateur> disableUtilisateur(@PathVariable String id) {
        return new ResponseEntity<>(utilisateurService.disableUtilisateur(id), HttpStatus.OK);
    }
    @PatchMapping("/archiver/{id}")
    public ResponseEntity<Utilisateur> archiveUtilisateur(@PathVariable String id) {
        return new ResponseEntity<>(utilisateurService.archiveUtilisateur(id), HttpStatus.OK);
    }

    @PutMapping("/{id}/changer-mot-de-passe")
    public ResponseEntity<Void> changePassword(@PathVariable String id, @RequestBody ChangePasswordRequest request) {
        utilisateurService.changePassword(id, request.getAncienMotDePasse(), request.getNouveauMotDePasse());
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
