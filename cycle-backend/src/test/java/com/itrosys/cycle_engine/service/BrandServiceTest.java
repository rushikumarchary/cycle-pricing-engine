package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.BrandResponse;
import com.itrosys.cycle_engine.exception.BrandNotFound;
import com.itrosys.cycle_engine.exception.DuplicateBrand;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test") // Uses application-test.properties
@Transactional // Rolls back data after each test
class BrandServiceTest {


    @MockitoBean// Mock JWTService to avoid security dependency issues
    private JWTService jwtService;
    @Autowired
    private BrandService brandService;


    // this pass when brand all ready exist and active state
    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void testAddBrand_DuplicateActiveBrand() {
        Exception exception = assertThrows(DuplicateBrand.class, () -> brandService.addBrand("HERO"));
        System.out.println(" Test Passed: " + exception.getMessage());
    }

    // this test check the brand is available and not active then reactive
    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void testAddBrand_ReactivateBrand() {
        BrandResponse response = brandService.addBrand("GIANT");
        assertNotNull(response);
        assertEquals("GIANT", response.getName());
        System.out.println(" Test Passed: " + response);
    }

    // pass when  brand not completely not present in database
    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void testAddBrand_NewBrand() {
        BrandResponse response = brandService.addBrand("BAJAJ");
        assertNotNull(response);
        assertEquals("BAJAJ", response.getName());
        System.out.println(" Test Passed: " + response);

    }

    // check the brand id not found then throw exception
    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void testUpdateBrand_BrandNotFound() {
        Exception exception = assertThrows(BrandNotFound.class, () -> brandService.updateBrandName(99, "TATA"));
        System.out.println("Test Pass " + exception.getMessage());
    }

    // this check the brand allReady updated with same id
    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void testUpdateBrand_AllReadyUpdated() {
        Exception exception = assertThrows(DuplicateBrand.class, () -> brandService.updateBrandName(2, "GIANT"));
        System.out.println("Test Pass : " + exception.getMessage());
    }

    // check the brand present but different for Brand id
    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void testUpdateBrand_DuplicateBrand() {
        Exception exception = assertThrows(DuplicateBrand.class, () -> brandService.updateBrandName(2, "ATLAS"));
        System.out.println("Test Pass : " + exception.getMessage());
    }

    // Pass when brand name not completely not present in database
    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void testUpdateBrand_Success() {
        BrandResponse response = brandService.updateBrandName(2, "TATA");
        assertNotNull(response);
        assertEquals("TATA", response.getName());
        System.out.println("Test Pass : " + response);
    }

    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void testDeleteBrand_Success() {
        BrandResponse brandResponse = assertDoesNotThrow(() -> brandService.deleteBrandById(2));
        System.out.println("Test Pass : " + brandResponse);
    }

    @Test
    @WithMockUser(username = "testUser", roles = {"ADMIN"})
    void testDeleteBrand_BrandNotFound() {
        BrandNotFound brandNotFound = assertThrows(BrandNotFound.class, () -> brandService.deleteBrandById(99));

        System.out.println("Test Pass : " + brandNotFound.getMessage());

    }


}