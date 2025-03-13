package com.example.cpe.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.cpe.dto.ActiveStatus;
import com.example.cpe.entities.Brands;
import com.example.cpe.entities.Items;

public interface ItemRepository extends JpaRepository<Items, Long> {

	@Query("SELECT i FROM Items i WHERE i.itemName = :itemName AND i.itemType = :itemType "
			+ "AND i.brand.brandId = :brandId AND i.validTo >= :pricingDate ORDER BY i.validTo DESC")
	List<Items> findValidItems(@Param("itemName") String itemName, @Param("itemType") String itemType,
			@Param("brandId") Integer brandId, @Param("pricingDate") Date pricingDate);

	List<Items> findByBrand_BrandName(String brandName);

	List<Items> findByBrand(Brands brand);

    @Query("SELECT i FROM Items i WHERE i.isActive = 'Y'")
    List<Items> findAllActiveItems();

	@Query("SELECT i FROM Items i WHERE i.brand.brandName = :brandName AND i.isActive = 'Y'")
	List<Items> findActiveItemsByBrand(@Param("brandName") String brandName);

}
