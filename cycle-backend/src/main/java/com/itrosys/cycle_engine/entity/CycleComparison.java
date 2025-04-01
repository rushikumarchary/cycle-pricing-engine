package com.itrosys.cycle_engine.entity;

import com.itrosys.cycle_engine.enums.VariantType;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cycle_comparison")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CycleComparison {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "compare_id", unique = true, nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "variant", nullable = false)
    private VariantType variant;

}

