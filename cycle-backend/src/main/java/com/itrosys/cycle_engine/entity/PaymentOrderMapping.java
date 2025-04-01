package com.itrosys.cycle_engine.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "payment_order_mapping")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentOrderMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "payment_order_id", nullable = false)
    private PaymentOrder paymentOrder;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Orders order;
} 