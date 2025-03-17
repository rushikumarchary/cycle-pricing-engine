package com.SpringBatch.Controller;

import com.SpringBatch.Entity.Brand;
import com.SpringBatch.Service.BrandService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class) // Enables Mockito for JUnit 5
class BrandControllerTest {

    @Mock
    private BrandService brandService; // Mock the service layer

    @InjectMocks
    private BrandController brandController; // Inject mock service into controller

    private Brand brand1, brand2;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this); // Initialize mocks

        // Sample brands for testing
        brand1 = new Brand(1, "BrandA", 'Y', "Admin", null);
        brand2 = new Brand(2, "BrandB", 'N', "User", null);
    }

    @Test
    void testGetAllBrands() {
        // Mock service response
        List<Brand> brandList = Arrays.asList(brand1, brand2);
        when(brandService.getAllBrands()).thenReturn(brandList);

        // Call controller method
        List<Brand> result = brandController.getAllBrands();

        // Assertions
        assertEquals(2, result.size());
        assertEquals("BrandA", result.get(0).getBrandName());
        verify(brandService, times(1)).getAllBrands();
    }

    @Test
    void testGetBrandById() {
        // Mock service response
        when(brandService.getBrandById(1)).thenReturn(brand1);

        // Call controller method
        ResponseEntity<Brand> response = brandController.getBrandById(1);

        // Assertions
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals("BrandA", response.getBody().getBrandName());
        verify(brandService, times(1)).getBrandById(1);
    }

    @Test
    void testCreateBrand() {
        // Mock service response
        when(brandService.createBrand(any(Brand.class))).thenReturn(brand1);

        // Call controller method
        ResponseEntity<Brand> response = brandController.createBrand(brand1);

        // Assertions
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals("BrandA", response.getBody().getBrandName());
        verify(brandService, times(1)).createBrand(any(Brand.class));
    }

    @Test
    void testUpdateBrand() {
        // Mock service response
        when(brandService.updateBrand(eq(1), any(Brand.class))).thenReturn(brand1);

        // Call controller method
        Brand response = brandController.UpdateBrand(1, brand1);

        // Assertions
        assertEquals("BrandA", response.getBrandName());
        verify(brandService, times(1)).updateBrand(eq(1), any(Brand.class));
    }

    @Test
    void testDeleteBrand() {
        // Call controller method
        brandController.deleteBrand(1);

        // Verify delete method is called
        verify(brandService, times(1)).deleteBrand(1);
    }
}
