package com.sn.namora.backend.mapper;

import com.sn.namora.backend.dto.response.DetailsVenteResponse;
import com.sn.namora.backend.dto.response.VenteResponse;
import com.sn.namora.backend.model.DetailsVente;
import com.sn.namora.backend.model.Vente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring")
public interface VenteMapper {
    @Mapping(source = "client.nom", target = "nomClient")
    @Mapping(source = "client.prenom", target = "prenomClient")

    VenteResponse toDto(Vente vente);
    @Mapping(source = "produit.id", target = "produitId")
    @Mapping(source = "produit.nom", target = "nomProduit")
    @Mapping(source = "produit.prixVente", target = "prixUnitaireVente", qualifiedByName = "bigDecimalToInt")
    @Mapping(target = "total", expression = "java(calculerTotal(detail))")
    DetailsVenteResponse toDetailDto(DetailsVente detail);
    @Named("bigDecimalToInt")
    default int bigDecimalToInt(BigDecimal value) {
        return value != null ? value.intValue() : 0;
    }
    default int calculerTotal(DetailsVente detail) {
        if (detail == null || detail.getProduit() == null
                || detail.getProduit().getPrixVente() == null) {
            return 0;
        }
        return detail.getProduit().getPrixVente().intValue() * detail.getQuantiteVendu();
    }



    List<DetailsVenteResponse> toDetailDtoList(List<DetailsVente> details);
}