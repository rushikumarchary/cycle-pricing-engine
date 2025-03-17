package com.SpringBatch.Service;

import com.SpringBatch.Entity.Brand;
import com.SpringBatch.Repo.BrandRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BrandServiceTest {

    @Mock
    private BrandRepository brandRepository;

    @InjectMocks
    private BrandService brandService;

    private Brand brand;

    @BeforeEach
    void setUp() {
        brand = new Brand(1, "BrandX", 'Y', "Admin", null);
    }

    @Test
    void testGetBrandById() {
        when(brandRepository.findById(1)).thenReturn(Optional.of(brand));

        Brand foundBrand = brandService.getBrandById(1);

        assertNotNull(foundBrand);
        assertEquals("BrandX", foundBrand.getBrandName());
    }

    @Test
    void testCreateBrand() {
        when(brandRepository.save(any(Brand.class))).thenReturn(brand);

        Brand savedBrand = brandService.createBrand(brand);

        assertNotNull(savedBrand);
        assertEquals("BrandX", savedBrand.getBrandName());
        System.out.println("Test passed "+savedBrand.getBrandName());
    }


}
