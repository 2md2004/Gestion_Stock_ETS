package com.sn.namora.backend.repository;

import com.sn.namora.backend.model.DetailsVente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DetailsVenteRepository extends JpaRepository<DetailsVente, String> {
    @Query("""
            SELECT MAX(SUBSTRING(v.id,9))
            FROM DetailsVente v
            WHERE v.vente.date = :date
    """)
    String getMaxVenteJour(@Param("date") LocalDate date);

    @Query("""
            SELECT dv FROM DetailsVente dv
            JOIN FETCH dv.produit p
            WHERE dv.vente.date BETWEEN :debut AND :fin
    """)
    List<DetailsVente> findByDateBetween(@Param("debut") LocalDate debut, @Param("fin") LocalDate fin);

}
