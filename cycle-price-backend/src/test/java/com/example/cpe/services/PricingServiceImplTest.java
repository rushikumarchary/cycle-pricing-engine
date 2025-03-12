package com.example.cpe.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.cpe.entities.Items;
import com.example.cpe.repository.ItemRepository;
import com.example.cpe.services.impl.PricingServiceImpl;

@SpringBootTest
class PricingServiceImplTest {

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private PricingServiceImpl pricingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCalculatePrice() {
        Date pricingDate = new Date();
        
        Map<String, Map<String, Object>> cycleConfig = new HashMap<>();
        
        Map<String, Object> component1 = new HashMap<>();
        component1.put("name", "Gear");
        component1.put("brandId", 1);
        component1.put("quantity", 2);
        cycleConfig.put("Gear", component1);

        Items item = new Items();
        item.setItemName("Gear");
        item.setPrice(2000.0);
        item.setValidTo(pricingDate);

        when(itemRepository.findValidItems("Gear", "Gear", 1, pricingDate)).thenReturn(Collections.singletonList(item));

        Map<String, Object> response = pricingService.calculatePrice(cycleConfig, pricingDate);

        assertNotNull(response);
        assertEquals(new BigDecimal("4000.00"), response.get("totalPriceBeforeDiscount"));
        assertEquals(new BigDecimal("200.00"), response.get("discountApplied"));
        assertEquals(new BigDecimal("684.00"), response.get("gstAmount"));
        assertEquals(new BigDecimal("4484.00"), response.get("finalPrice"));
    }

    @Test
    void testCalculatePriceWithNoValidItems() {
        Date pricingDate = new Date();
        Map<String, Map<String, Object>> cycleConfig = new HashMap<>();
        
        Map<String, Object> component1 = new HashMap<>();
        component1.put("name", "Gear");
        component1.put("brandId", 1);
        component1.put("quantity", 2);
        cycleConfig.put("Gear", component1);

        when(itemRepository.findValidItems("Gear", "Gear", 1, pricingDate)).thenReturn(Collections.emptyList());

        Map<String, Object> response = pricingService.calculatePrice(cycleConfig, pricingDate);

        assertNotNull(response);
        assertEquals(BigDecimal.ZERO, response.get("totalPriceBeforeDiscount"));
        assertTrue(response.containsKey("warning"));
    }
}
