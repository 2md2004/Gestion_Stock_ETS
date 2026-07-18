package com.sn.namora.backend.service;

import com.sn.namora.backend.model.Client;
import com.sn.namora.backend.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClientService {
    private final ClientRepository clientRepository;

    public Client create(Client client) {
        return clientRepository.save(client);
    }

    public List<Client> findAll() {
        return clientRepository.findAll();
    }

    public Optional<Client> findById(Long id) {
        return clientRepository.findById(id);
    }

    public List<Client> search(String query) {
        return clientRepository.findByNomContainingOrPrenomContaining(query, query);
    }

    public Client update(Long id, Client updated) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));
        client.setPrenom(updated.getPrenom());
        client.setNom(updated.getNom());
        client.setTelephone(updated.getTelephone());
        return clientRepository.save(client);
    }

    public void delete(Long id) {
        clientRepository.deleteById(id);
    }
}
