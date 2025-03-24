package com.itrosys.cycle_engine.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double unitPrice;

    @Column(nullable = false)
    private Double totalPrice;

    // Cycle Specifications
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

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "order_id", nullable = false)
    private OrderDetails orderDetails;
}
