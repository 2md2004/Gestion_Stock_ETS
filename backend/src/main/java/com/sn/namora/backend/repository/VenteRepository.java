package com.sn.namora.backend.repository;

import com.sn.namora.backend.model.Vente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface VenteRepository extends JpaRepository<Vente, String> {

    List<Vente> findByDate(LocalDate date);

    List<Vente> findByDateBetween(LocalDate debut, LocalDate fin);

    @Query("""
            SELECT MAX(SUBSTRING(v.id,9))
            FROM Vente v
            WHERE v.date = :date
    """)
    String getMaxVenteJour(@Param("date") LocalDate date);

    @Override
    Page<Vente> findAll(Pageable pageable);

    @Query("SELECT COUNT(v) FROM Vente v WHERE v.date = :date")
    int getNbreVentesDuJour(@Param("date") LocalDate date);
    @Query("""
            SELECT COALESCE(SUM(dv.quantiteVendu * (p.prixVente - p.prixAchat)), 0)
            FROM Vente v
            JOIN v.details dv
            JOIN dv.produit p
            WHERE v.date = :date
    """)
    BigDecimal getBeneficeJour(@Param("date") LocalDate date);
    @Query("""
            SELECT COALESCE(SUM(dv.quantiteVendu * (p.prixVente - p.prixAchat)), 0)
            FROM Vente v
            JOIN v.details dv
            JOIN dv.produit p
            WHERE FUNCTION('MONTH', v.date) = :mois
            AND FUNCTION('YEAR', v.date) = :annee
    """)
    BigDecimal getBeneficeMois(@Param("mois") int mois, @Param("annee") int annee);

    @Query("""
            SELECT COALESCE(SUM(dv.quantiteVendu * (p.prixVente - p.prixAchat)), 0)
            FROM Vente v
            JOIN v.details dv
            JOIN dv.produit p
            WHERE FUNCTION('YEAR', v.date) = :annee
    """)
    BigDecimal getBeneficeAnnee(@Param("annee") int annee);

    @Query("""
            SELECT COALESCE(SUM(dv.quantiteVendu * p.prixVente), 0)
            FROM Vente v
            JOIN v.details dv
            JOIN dv.produit p
            WHERE FUNCTION('MONTH', v.date) = :mois
            AND FUNCTION('YEAR', v.date) = :annee
    """)
    BigDecimal getChiffreAffaireMois(@Param("mois") int mois, @Param("annee") int annee);

    @Query("""
            SELECT COALESCE(SUM(dv.quantiteVendu * p.prixVente), 0)
            FROM Vente v
            JOIN v.details dv
            JOIN dv.produit p
            WHERE FUNCTION('YEAR', v.date) = :annee
    """)
    BigDecimal getChiffreAffaireAnnee(@Param("annee") int annee);

    @Query("""
            SELECT COALESCE(SUM(dv.quantiteVendu * p.prixAchat), 0)
            FROM Vente v
            JOIN v.details dv
            JOIN dv.produit p
            WHERE FUNCTION('MONTH', v.date) = :mois
            AND FUNCTION('YEAR', v.date) = :annee
    """)
    BigDecimal getCoutAchatMois(@Param("mois") int mois, @Param("annee") int annee);

    @Query("""
            SELECT COALESCE(SUM(dv.quantiteVendu * p.prixAchat), 0)
            FROM Vente v
            JOIN v.details dv
            JOIN dv.produit p
            WHERE FUNCTION('YEAR', v.date) = :annee
    """)
    BigDecimal getCoutAchatAnnee(@Param("annee") int annee);

    @Query(value = """
        SELECT 
            DAYNAME(v.date) as jour,
            COALESCE(SUM(v.montant_total), 0) as total
        FROM vente v
        WHERE WEEK(v.date) = WEEK(CURDATE())
        AND YEAR(v.date) = YEAR(CURDATE())
        GROUP BY DAYNAME(v.date)
        ORDER BY FIELD(DAYNAME(v.date), 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')
""", nativeQuery = true)
    List<Object[]> getVentesParJour();
}