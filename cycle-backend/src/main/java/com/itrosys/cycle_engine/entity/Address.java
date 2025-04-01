package com.itrosys.cycle_engine.entity;

import com.itrosys.cycle_engine.enums.AddressType;
import jakarta.persistence.*;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    // Ensuring address is linked to a user
    private User user;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "mobile_number", nullable = false, length = 15)
    private String mobileNumber;

    @Column(name = "pin_code", nullable = false, length = 10)
    private String pinCode;

    @Column(name = "flat_house_no", nullable = false)
    private String flatHouseNo;

    @Column(name = "apartment")
    private String apartment;

    @Column(name = "area_street", nullable = false)
    private String areaStreet;

    @Column(name = "landmark")
    private String landmark;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "state", nullable = false)
    private String state;

    @Enumerated(EnumType.STRING)
    @Column(name = "address_type", nullable = false)
    private AddressType addressType;

    @Column(name = "delivery_instructions", columnDefinition = "TEXT")
    private String deliveryInstructions;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "postal_metadata_id")
    private PostalMetadata postalMetadata;
}
