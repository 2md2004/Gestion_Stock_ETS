package com.sn.namora.backend.service;


import com.sn.namora.backend.repository.CategorieRepository;
import com.sn.namora.backend.repository.ProduitRepository;
import com.sn.namora.backend.repository.VenteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatsService {
    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;
    private final VenteRepository venteRepository;
    public Map<String, Object>  getStats() {
        Long nbreCategories = produitRepository.count();
        Long nbreProduits = produitRepository.count();
        int stockFaible = produitRepository.nbreStockFaible(5);
        int nbreVentesDuJour = venteRepository.getNbreVentesDuJour(LocalDate.now());
        Map<String, Object>  stats = new HashMap<>();
        stats.put("totalCategories", categorieRepository.count());
        stats.put("valeurStock", produitRepository.calculerValeurStock());
        stats.put("totalProduits", produitRepository.count());
        stats.put("stockFaible", stockFaible);
        stats.put("nbreVentesDuJour", nbreVentesDuJour);
        return stats;
    }
}
