package com.sn.namora.backend.repository;

import com.sn.namora.backend.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClientRepository extends JpaRepository<Client, Long> {
    List<Client> findByNomContainingOrPrenomContaining(String nom, String prenom);
}
