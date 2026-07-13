package com.sn.namora.backend.repository;

import com.sn.namora.backend.model.Produit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProduitRepository extends JpaRepository<Produit, String> {
    Optional<Produit> findByNom(String nom);
    List<Produit> findByCategorie(String categorie);
    @Override
    Page<Produit> findAll(Pageable pageable);
    @Query("SELECT COUNT(p) FROM Produit p WHERE p.quantite <= 5")
    int nbreStockFaible(int quantite);

    List<Produit> findByNomContaining(String nom);



}
