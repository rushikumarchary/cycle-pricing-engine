package com.SpringBatch.Repo;

import com.SpringBatch.Entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

//@Repository
//public interface BrandRepository extends JpaRepository<Brand, Integer> {
//    boolean existsByBrandName(String brandName);
//}
public interface BrandRepository extends JpaRepository<Brand, Integer> {

    // Custom query to search brands by name (case insensitive)
    @Query("SELECT b FROM Brand b WHERE LOWER(b.brandName) LIKE LOWER(CONCAT('%', :name, '%')) AND b.isActive = 'Y'")
    List<Brand> searchActiveBrandsByName(@Param("name") String name);

    boolean existsByBrandName(String brandName);
}

