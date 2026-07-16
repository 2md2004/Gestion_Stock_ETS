package com.sn.namora.backend.service;

import com.sn.namora.backend.dto.request.DetailsVenteRequest;
import com.sn.namora.backend.dto.request.VenteRequest;
import com.sn.namora.backend.exceptions.VenteNotFoundException;
import com.sn.namora.backend.model.DetailsVente;
import com.sn.namora.backend.model.Produit;
import com.sn.namora.backend.model.Vente;
import com.sn.namora.backend.repository.DetailsVenteRepository;
import com.sn.namora.backend.repository.ProduitRepository;
import com.sn.namora.backend.repository.VenteRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VenteService {
    private final VenteRepository venteRepository;
    private final ProduitRepository produitRepository;
    private final DetailsVenteService detailsVenteService;
    private final DetailsVenteRepository detailsVenteRepository;
    public Vente createVente(){
        Vente vente = new Vente();
        vente.setId(generateId());
        vente.setDate(LocalDate.now());
        vente.setMontantTotal(new BigDecimal("0"));
        return venteRepository.save(vente);
    }
    @Transactional
    public Vente createVenteWithDetails(VenteRequest dto) {
        Vente vente = new Vente();
        vente.setId(generateId());
        vente.setDate(dto.getDate() != null ? dto.getDate() : LocalDate.now());
        venteRepository.save(vente);

        int total = 0;
        List<DetailsVente> details = new ArrayList<>();


        List<String> detailIds = generateDetailIds(dto.getDetailsVenteRequests().size());

        for (int i = 0; i < dto.getDetailsVenteRequests().size(); i++) {
            DetailsVenteRequest ligne = dto.getDetailsVenteRequests().get(i);
            Produit produit = produitRepository.findById(ligne.getIdProduit())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Produit introuvable : " + ligne.getIdProduit()
                            )
                    );

            DetailsVente detail = new DetailsVente();
            detail.setId(detailIds.get(i));
            detail.setVente(vente);
            detail.setProduit(produit);
            detail.setQuantiteVendu(ligne.getQuantiteVendu());
            details.add(detail);

            produit.setQuantite(
                    produit.getQuantite() - ligne.getQuantiteVendu()
            );
            produitRepository.save(produit);
            total += produit.getPrixVente().intValue() * ligne.getQuantiteVendu();
        }

        detailsVenteRepository.saveAll(details);
        vente.setDetails(details);
        vente.setMontantTotal(BigDecimal.valueOf(total));
        return venteRepository.save(vente);
    }

    // Ajoutez cette méthode dans VenteService
    private List<String> generateDetailIds(int count) {
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

        List<String> ids = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            ids.add(date + String.format("%03d", numero + i));
        }
        return ids;
    }
    public Optional<Vente> findById(String id){
        Optional<Vente> venteOptional = venteRepository.findById(id);
        if (venteOptional.isPresent()){
            return venteRepository.findById(id);
        }
        else throw new VenteNotFoundException("Vente introuvable");
    }
    public Page<Vente> findAllVentes(int page, int size, String sortBy){
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        return venteRepository.findAll(pageable);
    }

    public List<Vente> findByDate(LocalDate date){
        return venteRepository.findByDate(date);
    }

    public void deleteVente(String id){
        Optional<Vente> venteOptional = venteRepository.findById(id);
        if (venteOptional.isPresent()){
            venteRepository.deleteById(id);
        }
        else throw new VenteNotFoundException("Vente introuvable");
    }

    public String generateId() {
        LocalDate now = LocalDate.now();
        String date = String.format("%04d%02d%02d",
                now.getYear(),
                now.getMonthValue(),
                now.getDayOfMonth()
        );

        String lastId = venteRepository.getMaxVenteJour(now);
        int numero = 1;
        if (lastId != null) {
            numero = Integer.parseInt(lastId) + 1;
        }
        String id = date + String.format("%03d", numero);
        return id;
    }
}
