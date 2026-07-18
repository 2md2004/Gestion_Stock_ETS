package com.sn.namora.backend.service;

import com.sn.namora.backend.repository.CategorieRepository;
import com.sn.namora.backend.repository.ProduitRepository;
import com.sn.namora.backend.repository.VenteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatsService {
    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;
    private final VenteRepository venteRepository;

    public Map<String, Object> getStats() {
        LocalDate now = LocalDate.now();
        int mois = now.getMonthValue();
        int annee = now.getYear();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCategories", categorieRepository.count());
        stats.put("valeurStock", produitRepository.calculerValeurStock());
        stats.put("totalProduits", produitRepository.count());
        stats.put("stockFaible", produitRepository.nbreStockFaible(5));
        stats.put("nbreVentesDuJour", venteRepository.getNbreVentesDuJour(now));

        try {
            stats.put("beneficeMois", venteRepository.getBeneficeMois(mois, annee));
        } catch (Exception e) {
            log.error("Erreur getBeneficeMois", e);
            stats.put("beneficeMois", BigDecimal.ZERO);
        }

        try {
            stats.put("chiffreAffaireMois", venteRepository.getChiffreAffaireMois(mois, annee));
        } catch (Exception e) {
            log.error("Erreur getChiffreAffaireMois", e);
            stats.put("chiffreAffaireMois", BigDecimal.ZERO);
        }

        try {
            stats.put("beneficeAnnee", venteRepository.getBeneficeAnnee(annee));
        } catch (Exception e) {
            log.error("Erreur getBeneficeAnnee", e);
            stats.put("beneficeAnnee", BigDecimal.ZERO);
        }

        try {
            stats.put("chiffreAffaireAnnee", venteRepository.getChiffreAffaireAnnee(annee));
        } catch (Exception e) {
            log.error("Erreur getChiffreAffaireAnnee", e);
            stats.put("chiffreAffaireAnnee", BigDecimal.ZERO);
        }

        try {
            List<Object[]> produitPlusVenduMois = produitRepository.getProduitPlusVenduMois(mois, annee);
            if (!produitPlusVenduMois.isEmpty()) {
                Object[] data = produitPlusVenduMois.get(0);
                Map<String, Object> produit = new HashMap<>();
                produit.put("id", data[0]);
                produit.put("nom", data[1]);
                produit.put("quantite", data[2]);
                stats.put("produitPlusVenduMois", produit);
            }
        } catch (Exception e) {
            log.error("Erreur getProduitPlusVenduMois", e);
        }

        try {
            List<Object[]> produitPlusVenduAnnee = produitRepository.getProduitPlusVenduAnnee(annee);
            if (!produitPlusVenduAnnee.isEmpty()) {
                Object[] data = produitPlusVenduAnnee.get(0);
                Map<String, Object> produit = new HashMap<>();
                produit.put("id", data[0]);
                produit.put("nom", data[1]);
                produit.put("quantite", data[2]);
                stats.put("produitPlusVenduAnnee", produit);
            }
        } catch (Exception e) {
            log.error("Erreur getProduitPlusVenduAnnee", e);
        }

        try {
            List<Object[]> top5Mois = produitRepository.getTop5ProduitsPlusVendusMois(mois, annee);
            stats.put("top5ProduitsMois", convertirEnListe(top5Mois));
        } catch (Exception e) {
            log.error("Erreur getTop5ProduitsPlusVendusMois", e);
            stats.put("top5ProduitsMois", new ArrayList<>());
        }

        try {
            List<Object[]> top5Annee = produitRepository.getTop5ProduitsPlusVendusAnnee(annee);
            stats.put("top5ProduitsAnnee", convertirEnListe(top5Annee));
        } catch (Exception e) {
            log.error("Erreur getTop5ProduitsPlusVendusAnnee", e);
            stats.put("top5ProduitsAnnee", new ArrayList<>());
        }

        try {
            stats.put("ventesParJour", getVentesParJour());
        } catch (Exception e) {
            log.error("Erreur getVentesParJour", e);
            stats.put("ventesParJour", new ArrayList<>());
        }

        return stats;
    }

    private List<Map<String, Object>> getVentesParJour() {
        List<Object[]> result = venteRepository.getVentesParJour();
        List<Map<String, Object>> data = new ArrayList<>();

        Map<String, String> joursMap = new HashMap<>();
        joursMap.put("Monday", "Lun");
        joursMap.put("Tuesday", "Mar");
        joursMap.put("Wednesday", "Mer");
        joursMap.put("Thursday", "Jeu");
        joursMap.put("Friday", "Ven");
        joursMap.put("Saturday", "Sam");
        joursMap.put("Sunday", "Dim");

        String[] jours = {"Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"};
        Map<String, Double> mapVentes = new HashMap<>();

        for (Object[] row : result) {
            String jour = (String) row[0];
            Double total = ((Number) row[1]).doubleValue();
            String jourFr = joursMap.getOrDefault(jour, jour.substring(0, 3));
            mapVentes.put(jourFr, total);
        }

        for (String jour : jours) {
            Map<String, Object> item = new HashMap<>();
            item.put("jour", jour);
            item.put("ventes", mapVentes.getOrDefault(jour, 0.0));
            data.add(item);
        }

        return data;
    }

    private List<Map<String, Object>> convertirEnListe(List<Object[]> data) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] item : data) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", item[0]);
            map.put("nom", item[1]);
            map.put("quantite", item[2]);
            result.add(map);
        }
        return result;
    }
}
