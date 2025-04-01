package com.itrosys.cycle_engine.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "postal_metadata")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostalMetadata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "branch_type")
    private String branchType;

    @Column(name = "delivery_status")
    private String deliveryStatus;

    private String circle;
    private String district;
    private String division;
    private String region;
    private String country;

    @OneToOne(mappedBy = "postalMetadata")
    private Address address;
} 