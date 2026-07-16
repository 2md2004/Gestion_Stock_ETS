package com.sn.namora.backend.repository;

import com.sn.namora.backend.model.DetailsVente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface DetailsVenteRepository extends JpaRepository<DetailsVente, String> {
    @Query("""
            SELECT MAX(SUBSTRING(v.id,9))
            FROM DetailsVente v
            WHERE v.vente.date = :date
    """)
    String getMaxVenteJour(@Param("date") LocalDate date);

}
