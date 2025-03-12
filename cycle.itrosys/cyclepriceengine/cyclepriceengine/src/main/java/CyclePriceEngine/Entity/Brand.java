package CyclePriceEngine.Entity;
import CyclePriceEngine.Constants.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "brands")
@Data
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brand_id")
    private Long brandId;

    @Column(name = "brand_name", nullable = false, unique = true)
    private String brandName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false,name="status")
    private Status status ; // Default to ACTIVE ('Y')

    @Column(nullable = false)
    private String updatedBy;

    @Column(name = "updated_at", nullable = false, updatable = false, insertable = false,
            columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime updatedAt;





}
