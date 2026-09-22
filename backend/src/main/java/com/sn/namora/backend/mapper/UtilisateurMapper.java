package com.sn.namora.backend.mapper;

import com.sn.namora.backend.dto.response.UtilisateurResponse;
import com.sn.namora.backend.model.Utilisateur;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UtilisateurMapper {
    UtilisateurResponse toDto(Utilisateur utilisateur);
    List<UtilisateurResponse> toDto(List<Utilisateur> utilisateurs);
}
