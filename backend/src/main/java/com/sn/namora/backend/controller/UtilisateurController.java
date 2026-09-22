package com.sn.namora.backend.controller;

import com.sn.namora.backend.dto.request.ChangePasswordRequest;
import com.sn.namora.backend.dto.response.UtilisateurResponse;
import com.sn.namora.backend.enums.Etat;
import com.sn.namora.backend.model.Utilisateur;
import com.sn.namora.backend.service.UtilisateurService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/gerants")
public class UtilisateurController {
    private final UtilisateurService utilisateurService;

    @PostMapping
    public ResponseEntity<UtilisateurResponse> createUtilisateur(@RequestBody Utilisateur utilisateur) throws MessagingException {
        return new ResponseEntity<>(utilisateurService.createUtilisateur(utilisateur), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<UtilisateurResponse>> getAllUtilisateurs() {
        return new ResponseEntity<>(utilisateurService.getAllGerant(), HttpStatus.OK);
    }

    @GetMapping("/archives")
    public ResponseEntity<List<UtilisateurResponse>> getAllUtilisateursArchive() {
        return new ResponseEntity<>(utilisateurService.getAllUtilisateursByEtat(Etat.ARCHIVE), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UtilisateurResponse> getUtilisateurById(@PathVariable String id) {
        return new ResponseEntity<>(utilisateurService.getUtilisateurById(id), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UtilisateurResponse> updateUtilisateur(@PathVariable String id, @RequestBody Utilisateur utilisateur) {
        return new ResponseEntity<>(utilisateurService.updateUtilisateur(id, utilisateur), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable String id) {
        utilisateurService.deleteUtilisateurById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PatchMapping("/activer/{id}")
    public ResponseEntity<UtilisateurResponse> enableUtilisateur(@PathVariable String id) {
        return new ResponseEntity<>(utilisateurService.enableUtilisateur(id), HttpStatus.OK);
    }

    @PatchMapping("/desactiver/{id}")
    public ResponseEntity<UtilisateurResponse> disableUtilisateur(@PathVariable String id) {
        return new ResponseEntity<>(utilisateurService.disableUtilisateur(id), HttpStatus.OK);
    }

    @PatchMapping("/archiver/{id}")
    public ResponseEntity<UtilisateurResponse> archiveUtilisateur(@PathVariable String id) {
        return new ResponseEntity<>(utilisateurService.archiveUtilisateur(id), HttpStatus.OK);
    }

    @PutMapping("/{id}/changer-mot-de-passe")
    public ResponseEntity<Void> changePassword(@PathVariable String id, @RequestBody ChangePasswordRequest request) {
        utilisateurService.changePassword(id, request.getAncienMotDePasse(), request.getNouveauMotDePasse());
        return new ResponseEntity<>(HttpStatus.OK);
    }
}