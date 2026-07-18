package com.sn.namora.backend.service;

import com.sn.namora.backend.model.Boutique;
import com.sn.namora.backend.repository.BoutiqueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BoutiqueService {

    private final BoutiqueRepository boutiqueRepository;

    private static final String UPLOAD_DIR = "backend" + File.separator + "images" + File.separator;

    public Optional<Boutique> getBoutique() {
        return boutiqueRepository.findAll().stream().findFirst();
    }

    public Boutique saveBoutique(Boutique boutique) {
        Optional<Boutique> existing = getBoutique();
        if (existing.isPresent()) {
            Boutique b = existing.get();
            b.setNom(boutique.getNom());
            b.setNinea(boutique.getNinea());
            b.setRccm(boutique.getRccm());
            b.setTelephone(boutique.getTelephone());
            b.setEmail(boutique.getEmail());
            b.setAdresse(boutique.getAdresse());
            if (boutique.getLogoPath() != null) {
                b.setLogoPath(boutique.getLogoPath());
            }
            return boutiqueRepository.save(b);
        }
        if (boutique.getId() == null) {
            boutique.setId(UUID.randomUUID().toString());
        }
        return boutiqueRepository.save(boutique);
    }

    public String uploadLogo(MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String ext = "";
        String originalName = file.getOriginalFilename();
        if (originalName != null && originalName.contains(".")) {
            ext = originalName.substring(originalName.lastIndexOf("."));
        }

        String filename = UUID.randomUUID() + ext;
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        Optional<Boutique> existing = getBoutique();
        if (existing.isPresent()) {
            Boutique b = existing.get();
            String oldPath = b.getLogoPath();
            b.setLogoPath(filename);
            boutiqueRepository.save(b);
            if (oldPath != null && !oldPath.isBlank()) {
                deleteFile(oldPath);
            }
        } else {
            Boutique b = new Boutique();
            b.setId(UUID.randomUUID().toString());
            b.setLogoPath(filename);
            boutiqueRepository.save(b);
        }

        return filename;
    }

    private void deleteFile(String filename) {
        try {
            Path path = Paths.get(UPLOAD_DIR).resolve(filename);
            Files.deleteIfExists(path);
        } catch (IOException ignored) {
        }
    }
}
