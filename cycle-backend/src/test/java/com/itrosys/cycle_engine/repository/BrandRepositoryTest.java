package com.itrosys.cycle_engine.repository;

import com.itrosys.cycle_engine.entity.Brand;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest // Load full Spring context
@ActiveProfiles("test") // Use application-test.properties
@Transactional // Rollback DB changes after each test
class BrandRepositoryTest {


    private final BrandRepository brandRepository;

    @Autowired
    public BrandRepositoryTest(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @Test
    void testFindByBrandName_BrandExists() {
        String brandName = "ATLAS";
        Optional<Brand> brand = brandRepository.findByBrandName(brandName);
        assertTrue(brand.isPresent());
        System.out.println("testFindByBrandName_BrandExists Passed: " + brand.get().getBrandName());
    }

    @Test
    void testFindByBrandName_BrandDoesNotExist() {
        String brandName = "TATA";
        Optional<Brand> brand = brandRepository.findByBrandName(brandName);
        assertFalse(brand.isPresent());
        System.out.println("testFindByBrandName_BrandDoesNotExist Passed: Brand not found.");


    }
}