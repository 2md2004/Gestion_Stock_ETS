package com.sn.namora.backend.repository;

import com.sn.namora.backend.model.Categorie;
import com.sn.namora.backend.model.Produit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProduitRepository extends JpaRepository<Produit, String> {
    Optional<Produit> findByNom(String nom);
    List<Produit> findByCategorie(Categorie categorie);
    List<Produit> findByCategorieNom(String categorieNom);
    @Override
    Page<Produit> findAll(Pageable pageable);
    @Query("SELECT COUNT(p) FROM Produit p WHERE p.quantite <= 5")
    int nbreStockFaible(int quantite);

    Page<Produit> findByQuantiteLessThanEqual(int quantite, Pageable pageable);

    List<Produit> findByNomContaining(String nom);
    @Query("SELECT SUM(p.prixAchat * p.quantite) FROM Produit p")
    Double calculerValeurStock();
    @Query(value = """
            SELECT p.id, p.nom, SUM(dv.quantite_vendu) as totalVendu
            FROM produit p
            JOIN details_vente dv ON p.id = dv.produit_id
            JOIN vente v ON dv.vente_id = v.id
            WHERE MONTH(v.date) = :mois
            AND YEAR(v.date) = :annee
            GROUP BY p.id, p.nom
            ORDER BY totalVendu DESC
            LIMIT 1
    """, nativeQuery = true)
    List<Object[]> getProduitPlusVenduMois(@Param("mois") int mois, @Param("annee") int annee);

    @Query(value = """
            SELECT p.id, p.nom, SUM(dv.quantite_vendu) as totalVendu
            FROM produit p
            JOIN details_vente dv ON p.id = dv.produit_id
            JOIN vente v ON dv.vente_id = v.id
            WHERE YEAR(v.date) = :annee
            GROUP BY p.id, p.nom
            ORDER BY totalVendu DESC
            LIMIT 1
    """, nativeQuery = true)
    List<Object[]> getProduitPlusVenduAnnee(@Param("annee") int annee);

    @Query(value = """
            SELECT p.id, p.nom, SUM(dv.quantite_vendu) as totalVendu
            FROM produit p
            JOIN details_vente dv ON p.id = dv.produit_id
            JOIN vente v ON dv.vente_id = v.id
            WHERE MONTH(v.date) = :mois
            AND YEAR(v.date) = :annee
            GROUP BY p.id, p.nom
            ORDER BY totalVendu DESC
            LIMIT 5
    """, nativeQuery = true)
    List<Object[]> getTop5ProduitsPlusVendusMois(@Param("mois") int mois, @Param("annee") int annee);

    @Query(value = """
            SELECT p.id, p.nom, SUM(dv.quantite_vendu) as totalVendu
            FROM produit p
            JOIN details_vente dv ON p.id = dv.produit_id
            JOIN vente v ON dv.vente_id = v.id
            WHERE YEAR(v.date) = :annee
            GROUP BY p.id, p.nom
            ORDER BY totalVendu DESC
            LIMIT 5
    """, nativeQuery = true)
    List<Object[]> getTop5ProduitsPlusVendusAnnee(@Param("annee") int annee);



}
