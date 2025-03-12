package com.example.cpe.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.cpe.dto.ActiveStatus;
import com.example.cpe.entities.Brands;
import com.example.cpe.entities.Items;

@Repository
public interface  BrandRepository extends  JpaRepository<Brands, Integer>{
	Optional<Brands> findByBrandName(String brandName);
	@Query("SELECT b FROM Brands b WHERE b.isActive = 'Y'")
	List<Brands> findAllActiveBrands();


	@Query("SELECT b FROM Brands b WHERE b.brandName = :brandName AND b.isActive = 'Y'")
	Optional<Brands> findActiveBrand(@Param("brandName") String brandName);

}
