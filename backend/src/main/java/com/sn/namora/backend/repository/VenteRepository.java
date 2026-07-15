package com.sn.namora.backend.repository;


import com.sn.namora.backend.model.Vente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface VenteRepository extends JpaRepository<Vente,String> {
    List<Vente> findByDate(LocalDate date);

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
}
