package com.sn.namora.backend.service;

import com.sn.namora.backend.dto.request.DetailsVenteRequest;
import com.sn.namora.backend.exceptions.ProduitNotFoundException;
import com.sn.namora.backend.exceptions.VenteNotFoundException;
import com.sn.namora.backend.model.DetailsVente;
import com.sn.namora.backend.model.Produit;
import com.sn.namora.backend.model.Vente;
import com.sn.namora.backend.repository.DetailsVenteRepository;
import com.sn.namora.backend.repository.ProduitRepository;
import com.sn.namora.backend.repository.VenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DetailsVenteService {
    private final DetailsVenteRepository detailsVenteRepository;
    private final VenteRepository venteRepository;
    private final ProduitRepository produitRepository;
    public DetailsVente createDetailsVente(DetailsVenteRequest detailsVenteRequest) {
        Optional<Vente> optionalVente = venteRepository.findById(detailsVenteRequest.getIdVente());
        if (optionalVente.isPresent()) {
            Optional<Produit> produitOptional = produitRepository.findById(detailsVenteRequest.getIdProduit());
            if (produitOptional.isPresent()) {
                DetailsVente detailsVente = new DetailsVente();
                detailsVente.setId(generateId());
                detailsVente.setVente(optionalVente.get());
                detailsVente.setProduit(produitOptional.get());
                detailsVente.setQuantiteVendu(detailsVenteRequest.getQuantiteVendu());
                return detailsVenteRepository.save(detailsVente);

            }
            else throw new ProduitNotFoundException("Produit introuvable");
        }
        else throw new VenteNotFoundException("Vente introuvable");

    }

    public List<DetailsVente> findAllDetailsVente() {
        return detailsVenteRepository.findAll();
    }

    public String generateId() {
        LocalDate now = LocalDate.now();
        String date = String.format("%04d%02d%02d",
                now.getYear(),
                now.getMonthValue(),
                now.getDayOfMonth()
        );
        String lastId = detailsVenteRepository.getMaxVenteJour(now);
        int numero = 1;
        if (lastId != null) {
            numero = Integer.parseInt(lastId) + 1;
        }
        String id = date + String.format("%03d", numero);
        return id;
    }
}
