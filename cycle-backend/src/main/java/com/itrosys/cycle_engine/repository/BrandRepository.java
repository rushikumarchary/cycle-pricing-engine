package com.itrosys.cycle_engine.repository;

import com.itrosys.cycle_engine.entity.Brand;
import com.itrosys.cycle_engine.enums.IsActive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {

    Optional<Brand> findByBrandName(String brandName);

    //	@Query("SELECT DISTINCT b FROM Brand b JOIN b.items i WHERE b.isActive = :isActive AND i.itemType IN :itemTypes")
//	List<Brand> findActiveBrandsWithItems(@Param("isActive") IsActive isActive, @Param("itemTypes") List<String> itemTypes);
//
    List<Brand> findAllByIsActive(IsActive isActive);

}
