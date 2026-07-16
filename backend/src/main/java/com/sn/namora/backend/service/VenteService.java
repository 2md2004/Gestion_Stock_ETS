package com.sn.namora.backend.service;

import com.sn.namora.backend.dto.PointRapport;
import com.sn.namora.backend.dto.RapportVenteResponse;
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
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
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
    public RapportVenteResponse genererRapport(String type, LocalDate dateReference) {
        LocalDate debut = null;
        LocalDate fin = null;
        List<PointRapport> points = new ArrayList<>();

        if (type.equals("hebdomadaire")) {
            debut = dateReference.with(DayOfWeek.MONDAY);
            fin = debut.plusDays(6);
            List<Vente> ventes = venteRepository.findByDateBetween(debut, fin);

            for (int i = 0; i < 7; i++) {
                LocalDate jour = debut.plusDays(i);
                BigDecimal total = sommeDuJour(ventes, jour);
                String label = jour.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.FRENCH);
                points.add(new PointRapport(capitalize(label), total));
            }
        }
        if (type.equals("mensuel")) {
            debut = dateReference.withDayOfMonth(1);
            fin = dateReference.withDayOfMonth(dateReference.lengthOfMonth());
            List<Vente> ventes = venteRepository.findByDateBetween(debut, fin);

            for (int i = 1; i <= fin.getDayOfMonth(); i++) {
                LocalDate jour = debut.withDayOfMonth(i);
                BigDecimal total = sommeDuJour(ventes, jour);
                points.add(new PointRapport(String.valueOf(i), total));
            }
        }
        if (type.equals("annuel")) {
            debut = dateReference.withDayOfYear(1);
            fin = dateReference.withMonth(12).withDayOfMonth(31);
            List<Vente> ventes = venteRepository.findByDateBetween(debut, fin);

            for (int mois = 1; mois <= 12; mois++) {
                int moisFinal = mois;
                BigDecimal total = ventes.stream()
                        .filter(v -> v.getDate().getMonthValue() == moisFinal)
                        .map(Vente::getMontantTotal)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                String label = LocalDate.of(dateReference.getYear(), mois, 1)
                        .getMonth().getDisplayName(TextStyle.FULL, Locale.FRENCH);
                points.add(new PointRapport(capitalize(label), total));
            }
        }
        if (debut == null || fin == null) {
            throw new IllegalArgumentException("Type de rapport invalide : " + type);
        }


        List<Vente> ventesPeriode = venteRepository.findByDateBetween(debut, fin);

        BigDecimal totalVentes = ventesPeriode.stream()
                .map(Vente::getMontantTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long nombreVentes = ventesPeriode.size();

        BigDecimal venteMoyenne = nombreVentes > 0
                ? totalVentes.divide(BigDecimal.valueOf(nombreVentes), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        // TODO : à remplacer dès que la relation Vente <-> Produit (DetailsVente) sera fusionnée
        String produitPlusVendu = null;
        Integer quantiteProduitPlusVendu = 0;
        BigDecimal beneficeTotal = BigDecimal.ZERO;

        return new RapportVenteResponse(
                type, debut, fin, totalVentes, nombreVentes, venteMoyenne, points,
                produitPlusVendu, quantiteProduitPlusVendu, beneficeTotal
        );
    }
    private BigDecimal sommeDuJour(List<Vente> ventes, LocalDate jour) {
        return ventes.stream()
                .filter(v -> v.getDate().equals(jour))
                .map(Vente::getMontantTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String capitalize(String texte) {
        if (texte == null || texte.isEmpty()) return texte;
        return texte.substring(0, 1).toUpperCase() + texte.substring(1);
    }
}
