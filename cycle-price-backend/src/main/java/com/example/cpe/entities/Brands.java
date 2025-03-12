package com.example.cpe.entities;
import java.time.LocalDateTime;
import java.util.List;

import com.example.cpe.dto.ActiveStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "brands") 
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties("items")
public class Brands {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "brand_id")
     private Integer brandId;
	
	 @Column(name = "brand_name")
	 private  String brandName;    
	 
	 
	 @OneToMany(mappedBy = "brand", cascade = CascadeType.ALL)
	  private List<Items> items;
	 

	 @Column(name = "is_active", nullable = false, columnDefinition = "CHAR(1) DEFAULT 'Y'")
	 @Enumerated(EnumType.STRING)  
	  private ActiveStatus isActive;

	 @Column(name = "modified_by", nullable = false, columnDefinition = "VARCHAR(255) DEFAULT 'admin'")
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
