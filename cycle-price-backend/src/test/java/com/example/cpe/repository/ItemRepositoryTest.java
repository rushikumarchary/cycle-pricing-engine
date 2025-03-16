package com.example.cpe.repository;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import com.example.cpe.dto.ActiveStatus;
import com.example.cpe.entities.Brands;
import com.example.cpe.entities.Items;

import jakarta.transaction.Transactional;
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ItemRepositoryTest {

    @Autowired
    private BrandRepository brandRepository;

    @Autowired
    private ItemRepository itemRepository;

    private Brands brand;
    private Items item1, item2;

    @BeforeEach
    void setUp() {
        brand = new Brands();
        brand.setBrandName("Trek");
        brand.setIsActive(ActiveStatus.Y);
        brandRepository.save(brand);

        item1 = new Items();
        item1.setItemName("Frame");
        item1.setItemType("Carbon");
        item1.setBrand(brand);
        item1.setPrice(5000.0);
        item1.setValidTo(new Date(System.currentTimeMillis() + 100000));
        item1.setIsActive(ActiveStatus.Y);
        itemRepository.save(item1);

        item2 = new Items();
        item2.setItemName("Wheels");
        item2.setItemType("Rim");
        item2.setBrand(brand);
        item2.setPrice(3000.0);
        item2.setValidTo(new Date(System.currentTimeMillis() - 100000)); 
        item2.setIsActive(ActiveStatus.Y);
        itemRepository.save(item2);
    }

    @Test
    void testFindValidItems() {
        List<Items> validItems = itemRepository.findValidItems("Frame", "Carbon", brand.getBrandId(), new Date());
        assertEquals(1, validItems.size());
        assertEquals("Frame", validItems.get(0).getItemName());
    }

    @Test
    void testFindByBrand_BrandName() {
        List<Items> items = itemRepository.findByBrand_BrandName("Trek");
        assertEquals(2, items.size());
    }

    @Test
    void testFindByBrand() {
        List<Items> items = itemRepository.findByBrand(brand);
        assertEquals(2, items.size());
    }

    @Test
    void testFindByIsActive() {
        List<Items> activeItems = itemRepository.findAllActiveItems();
        assertEquals(2, activeItems.size());
    }

    @Test
    void testFindActiveItemsByBrand() {
        List<Items> activeItems = itemRepository.findActiveItemsByBrand("Trek");
        assertEquals(2, activeItems.size());
    }
}

