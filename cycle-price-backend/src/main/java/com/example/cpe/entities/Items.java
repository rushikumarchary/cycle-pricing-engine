package com.example.cpe.entities;
import java.time.LocalDateTime;
import java.util.Date;

import com.example.cpe.dto.ActiveStatus;
import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "items")  
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Items {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @Column(name = "item_name") 
    private String itemName;

    @Column(name = "item_type")
    private String itemType;

    @Column(name = "price")
    private Double price;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @Column(name = "valid_to", columnDefinition = "DATETIME")
    private Date validTo;

    @ManyToOne
    @JoinColumn(name = "brand_id", referencedColumnName = "brand_id", nullable = false)  
    private Brands brand;  
    
    
    @Column(name = "is_active", nullable = false, columnDefinition = "CHAR(1) DEFAULT 'Y'")
    @Enumerated(EnumType.STRING) 
    private ActiveStatus isActive;

    @Column(name = "modified_by", nullable = false, length = 255, columnDefinition = "VARCHAR(255) DEFAULT 'admin'")
    private String modifiedBy;

    @Column(name = "modified_on", nullable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime modifiedOn;
    
    @PrePersist
	  protected void onCreate() {
	      this.modifiedOn = LocalDateTime.now(); // Correct method for LocalDateTime
	  }

	  @PreUpdate
	  protected void onUpdate() {
	      this.modifiedOn = LocalDateTime.now(); // Correct method for LocalDateTime
	  }
}
