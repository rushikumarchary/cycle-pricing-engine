package com.example.cpe.repository;

import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.example.cpe.dto.ActiveStatus;
import com.example.cpe.entities.Brands;

import jakarta.transaction.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional

class BrandRepositoryTest {

    @Autowired
    private BrandRepository brandRepository;

    private Brands brand1, brand2;

    @BeforeEach
    void setUp() {
        brand1 = new Brands();
        brand1.setBrandName("Trek");
        brand1.setIsActive(ActiveStatus.Y);
        brandRepository.save(brand1);

        brand2 = new Brands();
        brand2.setBrandName("Giant");
        brand2.setIsActive(ActiveStatus.N);
        brandRepository.save(brand2);
    }

    @Test
    void testFindByBrandName() {
        Optional<Brands> brand = brandRepository.findByBrandName("Trek");
        assertTrue(brand.isPresent());
        assertEquals("Trek", brand.get().getBrandName());
    }

    @Test
    void testFindAllActiveBrands() {
        List<Brands> activeBrands = brandRepository.findAllActiveBrands();
        assertEquals(1, activeBrands.size());
        assertEquals("Trek", activeBrands.get(0).getBrandName());
    }

    @Test
    void testFindActiveBrand() {
        Optional<Brands> activeBrand = brandRepository.findActiveBrand("Trek");
        assertTrue(activeBrand.isPresent());
        assertEquals("Trek", activeBrand.get().getBrandName());

        Optional<Brands> inactiveBrand = brandRepository.findActiveBrand("Giant");
        assertFalse(inactiveBrand.isPresent());
    }
}
