package com.itrosys.cycle_engine.entity;

import com.itrosys.cycle_engine.enums.IsActive;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Coupons {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(name = "coupon_code", nullable = false, unique = true)
    private String couponCode;

    @Column(name = "modified_by", nullable = false)
    private String modifiedBy;

    @Column(name ="discount_percentage", nullable = false)
    private double discountPercentage;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_active", nullable = false)
    private IsActive isActive;
}
