package com.sn.namora.backend.service;

import com.sn.namora.backend.exceptions.CategorieAlreadyExistException;
import com.sn.namora.backend.exceptions.CategorieNotFoundException;
import com.sn.namora.backend.model.Categorie;
import com.sn.namora.backend.repository.CategorieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategorieService {
    private final CategorieRepository categorieRepository;

    public Categorie createCategorie(Categorie categorie) {
        if  (categorieRepository.findByNom(categorie.getNom()).isPresent()) {
            throw new CategorieAlreadyExistException("Cette catégorie existe déjà");
        }
        return categorieRepository.save(categorie);
    }
    public Optional<Categorie> findById(Long id) {
        Optional<Categorie> categorieOptional = categorieRepository.findById(id);
        if (categorieOptional.isPresent()) {
            return categorieRepository.findById(id);
        }
        else throw new CategorieNotFoundException("Catégorie introuvable");
    }
    public Optional<Categorie> findByNom(String nom) {
        Optional<Categorie> categorieOptional = categorieRepository.findByNom(nom);
        if (categorieOptional.isPresent()) {
            return categorieRepository.findByNom(nom);
        }
        else throw new CategorieNotFoundException("Catégorie introuvable");
    }


    public List<Categorie> findAll() {
        return categorieRepository.findAll();
    }

    public void deleteCategorie(Long id) {
        Optional<Categorie> categorieOptional = categorieRepository.findById(id);
        if (categorieOptional.isPresent()) {
            categorieRepository.deleteById(id);
        }
        else throw new CategorieNotFoundException("Catégorie introuvable");
    }
    public Categorie updateCategorie(Long id,Categorie categorie) {
        Optional<Categorie> categorieOptional = categorieRepository.findById(id);
        if (categorieOptional.isPresent()) {
            Categorie old =  categorieOptional.get();
            old.setNom(categorie.getNom());
            old.setDescription(categorie.getDescription());

            return categorieRepository.save(old);
        }
        else throw new CategorieNotFoundException("Categorie introuvable");
    }
}
