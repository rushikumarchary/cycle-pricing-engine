package com.itrosys.cycle_engine.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "specifications")
@Getter
@Setter
public class Specifications {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String frame;

    @Column(nullable = false)
    private String handlebar;

    @Column(nullable = false)
    private String seating;

    @Column(nullable = false)
    private String wheel;

    @Column(nullable = false)
    private String brakes;

    @Column(nullable = false)
    private String tyre;

    @Column(nullable = false)
    private String chainAssembly;

    @OneToOne
    @JoinColumn(name = "order_id")
    private Orders order;
} 