package com.itrosys.cycle_engine.entity;

import com.itrosys.cycle_engine.enums.IsActive;
import jakarta.persistence.*;
import lombok.*;
import java.util.Date;

@Entity
@Table(name = "brands")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brand_id")
    private int brandId;

    @Column(name = "brand_name", nullable = false, unique = true)
    private String brandName;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_active", nullable = false)
    private IsActive isActive; // 'Y' or 'N'

    @Column(name = "modified_by", nullable = false)
    private String modifiedBy;

    @Column(name = "modified_on", nullable = false, updatable = false, insertable = false,
            columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    @Temporal(TemporalType.TIMESTAMP)
    private Date modifiedOn;


}
