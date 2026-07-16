package com.sn.namora.backend.service;

import com.sn.namora.backend.dto.PointRapport;
import com.sn.namora.backend.dto.RapportVenteResponse;
import com.sn.namora.backend.model.Vente;
import com.sn.namora.backend.repository.VenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class VenteService {

    private final VenteRepository venteRepository;
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