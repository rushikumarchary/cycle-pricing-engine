package ServiceTest;

import CyclePriceEngine.Constants.Status;
import CyclePriceEngine.CyclepriceengineApplication;
import CyclePriceEngine.DTO.BrandDTO;
import CyclePriceEngine.Entity.Brand;
import CyclePriceEngine.Exception.BrandNotFoundException;
import CyclePriceEngine.Repository.BrandRepository;
import CyclePriceEngine.Service.BrandService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(classes = CyclepriceengineApplication.class)
@Transactional
public class BrandServiceTest {

    @Autowired
    private BrandService brandService;

    @Autowired
    private BrandRepository brandRepository;

    @BeforeEach
    void setup() {
        Brand testBrand = new Brand();
        testBrand.setBrandId(1L);
        testBrand.setBrandName("Atlas");
        brandRepository.save(testBrand);
    }


    @Test
    void testAddBrand() {
        BrandDTO newBrandDTO = BrandDTO.builder()
                .brandName("Jagur")
                .status(Status.Y)
                .updatedBy("Admin")
                .build();

        BrandDTO savedBrand = brandService.addBrand(newBrandDTO);

        assertNotNull(savedBrand);
        assertEquals("Jagur", savedBrand.getBrandName());

        assertTrue(brandRepository.findByBrandName("Jagur").isPresent());
    }

    @Test
    void testAddBrand_AlreadyExists() {
        BrandDTO duplicateBrand = BrandDTO.builder()
                .brandName("Jagur")
                .status(Status.Y)
                .updatedBy("Admin")
                .build();

        Exception exception = assertThrows(RuntimeException.class, () -> {
            brandService.addBrand(duplicateBrand);
        });

        assertEquals("Brand already exists: Jagur", exception.getMessage());
    }

    @Test
    void testGetAllBrandNames() {
        List<String> brandNames = brandService.getAllBrandNames();

        assertFalse(brandNames.isEmpty());
    }

    @Test
    void testGetBrandById() {
        Brand existingBrand = brandRepository.findByBrandName("Giant").orElseThrow();
        BrandDTO brandDTO = brandService.getBrandById(existingBrand.getBrandId());

        assertNotNull(brandDTO);
        assertEquals("Giant", brandDTO.getBrandName());
    }

    @Test
    void testGetBrandById_NotFound() {
        Exception exception = assertThrows(BrandNotFoundException.class, () -> {
            brandService.getBrandById(999L);
        });

        assertEquals("Brand id is not found999", exception.getMessage());
    }

    @Test
    void testGetBrandByName() {
        BrandDTO brandDTO = brandService.getBrandByName("Atlas");

        assertNotNull(brandDTO);
        assertEquals("Atlas", brandDTO.getBrandName());
    }

    @Test
    void testGetBrandByName_NotFound() {
        Exception exception = assertThrows(BrandNotFoundException.class, () -> {
            brandService.getBrandByName("UnknownBrand");
        });

        assertEquals("Brand not found with name: UnknownBrand", exception.getMessage());
    }

    @Test
    void testUpdateBrand() {
        Brand existingBrand = brandRepository.findByBrandName("Atlas").orElseThrow();

        BrandDTO updateDTO = BrandDTO.builder()
                .brandId(existingBrand.getBrandId())
                .brandName("UpdatedAtlas")
                .status(Status.Y)
                .updatedBy("Admin")
                .build();

        BrandDTO updatedBrand = brandService.updateBrand(existingBrand.getBrandId(), updateDTO);

        assertNotNull(updatedBrand);
        assertEquals("UpdatedAtlas", updatedBrand.getBrandName());

        Brand brandInDb = brandRepository.findById(existingBrand.getBrandId()).orElseThrow();
        assertEquals("UpdatedAtlas", brandInDb.getBrandName());
    }

    @Test
    void testUpdateBrand_NotFound() {
        BrandDTO updateDTO = BrandDTO.builder()
                .brandId(9L)
                .brandName("UpdatedBrand")
                .status(Status.Y)
                .updatedBy("Admin")
                .build();

        Exception exception = assertThrows(BrandNotFoundException.class, () -> {
            brandService.updateBrand(9L, updateDTO);
        });

        assertEquals("Brand not found with ID: 9", exception.getMessage());
    }

    @Test
    void testDeleteBrand() {
        Brand existingBrand = brandRepository.findByBrandName("Jagur").orElseThrow();

        brandService.deleteBrandById(existingBrand.getBrandId());

        assertFalse(brandRepository.existsById(existingBrand.getBrandId()));
    }

    @Test
    void testDeleteBrandById_NotFound() {
        Exception exception = assertThrows(BrandNotFoundException.class, () -> {
            brandService.deleteBrandById(9L);
        });

        assertEquals("Brand with ID 9 not found.", exception.getMessage());
    }
}
