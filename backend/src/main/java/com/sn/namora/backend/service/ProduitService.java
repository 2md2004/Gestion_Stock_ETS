package com.sn.namora.backend.service;


import com.sn.namora.backend.dto.request.ProduitRequest;
import com.sn.namora.backend.exceptions.CategorieNotFoundException;
import com.sn.namora.backend.exceptions.ProduitNotFoundException;
import com.sn.namora.backend.model.Categorie;
import com.sn.namora.backend.model.Produit;
import com.sn.namora.backend.repository.CategorieRepository;
import com.sn.namora.backend.repository.ProduitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProduitService {
    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;
    public Produit create(ProduitRequest request) {
        Optional<Categorie> optionalCategorie = categorieRepository.findById(request.getCategorieId());
        if (optionalCategorie.isEmpty()) {
            throw new CategorieNotFoundException("Categorie Introuvable");
        }
        Produit produit = new Produit();
        produit.setId(UUID.randomUUID().toString().substring(0,8));
        produit.setNom(request.getNom());
        produit.setDescription(request.getDescription());
        produit.setPrixVente(request.getPrixVente());
        produit.setPrixAchat(request.getPrixAchat());
        produit.setQuantite(request.getQuantite());
        produit.setCategorie(optionalCategorie.get());
        return produitRepository.save(produit);
    }

    public Optional<Produit> findById(String id) {
        return produitRepository.findById(id);
    }
    public Page<Produit> findAllProduits(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        return produitRepository.findAll(pageable);
    }

    public Produit update(String id, ProduitRequest request) {

        Optional<Produit> produitOptional = produitRepository.findById(id);

        if (produitOptional.isPresent()) {

            Optional<Categorie> categorieOptional =
                    categorieRepository.findById(request.getCategorieId());

            if (categorieOptional.isPresent()) {

                Produit produit = produitOptional.get();

                produit.setNom(request.getNom());
                produit.setDescription(request.getDescription());
                produit.setPrixAchat(request.getPrixAchat());
                produit.setPrixVente(request.getPrixVente());
                produit.setQuantite(request.getQuantite());
                produit.setCategorie(categorieOptional.get());

                return produitRepository.save(produit);
            }

            throw new CategorieNotFoundException("Categorie introuvable");
        }

        throw new ProduitNotFoundException("Produit introuvable");
    }
    public void deleteById(String id) {
        Optional<Produit> produitOptional = produitRepository.findById(id);
        if (produitOptional.isPresent()) {
            produitRepository.deleteById(id);
        }
        else throw new ProduitNotFoundException("Produit introuvable");
    }
    public List<Produit> searchProduits(String nom) {
        return produitRepository.findByNomContaining(nom);
    }

    public Page<Produit> findProduitsStockFaible(int page, int size, String sortBy) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy).ascending());
        return produitRepository.findByQuantiteLessThanEqual(5, pageable);
    }

}
