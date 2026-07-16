package com.sn.namora.backend.model;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Vente {
    @Id
    @Column(length = 12)
    private String id;
    private LocalDate date;
    private BigDecimal montantTotal;
    @JsonManagedReference
    @ToString.Exclude
    @OneToMany(mappedBy = "vente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetailsVente> details = new ArrayList<>();
}
