package com.example.cpe.services;
import 
static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;

import com.example.cpe.dto.ActiveStatus;
import com.example.cpe.entities.Brands;
import com.example.cpe.entities.Items;
import com.example.cpe.exception.BrandNotFound;
import com.example.cpe.exception.DuplicateBrand;
import com.example.cpe.repository.BrandRepository;
import com.example.cpe.repository.ItemRepository;
import com.example.cpe.services.impl.BrandServiceImpl;

import jakarta.transaction.Transactional;


@SpringBootTest // Load full Spring context
@ActiveProfiles("test") // Use application-test.properties
@Transactional // Rollback DB changes after each test
class BrandServiceImplTest {

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private BrandServiceImpl brandService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllBrands() {
        List<Brands> brands = Arrays.asList(new Brands(1, "Hero", null, ActiveStatus.Y, null, null), new Brands(2, "Atlas", null, ActiveStatus.Y, null, null));
        when(brandRepository.findAllActiveBrands()).thenReturn(brands);

        List<Brands> result = brandService.getAllBrands();
        assertEquals(2, result.size());
        assertEquals("Hero", result.get(0).getBrandName());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testCreateBrand() {
        Brands brand = new Brands();
        brand.setBrandName("BSA");
        brand.setIsActive(ActiveStatus.Y);

        when(brandRepository.findByBrandName("BSA")).thenReturn(Optional.empty());
        when(brandRepository.save(any())).thenReturn(brand);

        String result = brandService.createBrand("BSA");

        assertEquals("Brand added successfully.", result);
        verify(brandRepository, times(1)).save(any());
    }

    @Test
    void testGetBrandById() {
        Brands brand = new Brands(1, "Hero", null, ActiveStatus.Y, null, null);
        when(brandRepository.findById(1)).thenReturn(Optional.of(brand));

        Brands result = brandService.getBrandById(1);

        assertEquals("Hero", result.getBrandName());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testUpdateBrand() {
        Brands brand = new Brands(1, "Hero", null, ActiveStatus.Y, null, null);
        when(brandRepository.findById(1)).thenReturn(Optional.of(brand));
        when(brandRepository.findByBrandName("Atlas")).thenReturn(Optional.empty());
        when(brandRepository.save(any())).thenReturn(brand);

        Brands result = brandService.updateBrand(1, "Atlas");

        assertEquals("Atlas", result.getBrandName());
        verify(brandRepository, times(1)).save(any());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void testDeleteBrand() {
        Brands brand = new Brands(1, "Hero", null, ActiveStatus.Y, null, null);
        List<Items> items = new ArrayList<>();

        when(brandRepository.findById(1)).thenReturn(Optional.of(brand));
        when(itemRepository.findByBrand(brand)).thenReturn(items);

        brandService.deleteBrand(1);

        assertEquals("N", brand.getIsActive());
        verify(brandRepository, times(1)).save(brand);
    }

    @Test
    void testBrandNotFoundException() {
        when(brandRepository.findById(100)).thenReturn(Optional.empty());

        assertThrows(BrandNotFound.class, () -> brandService.getBrandById(100));
    }
}
