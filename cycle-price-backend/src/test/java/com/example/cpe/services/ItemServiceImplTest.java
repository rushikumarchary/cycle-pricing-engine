package com.example.cpe.services;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.antlr.v4.runtime.misc.DoubleKeyMap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.cpe.dto.ActiveStatus;
import com.example.cpe.dto.ItemRequest;
import com.example.cpe.dto.ItemResponse;
import com.example.cpe.entities.Brands;
import com.example.cpe.entities.Items;
import com.example.cpe.exception.BrandNotFound;
import com.example.cpe.exception.ItemNotFound;
import com.example.cpe.repository.BrandRepository;
import com.example.cpe.repository.ItemRepository;
import com.example.cpe.services.impl.ItemServiceImpl;

@ExtendWith(MockitoExtension.class)
class ItemServiceImplTest {

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private BrandRepository brandRepository;

    @InjectMocks
    private ItemServiceImpl itemService;
    final private ActiveStatus Active = ActiveStatus.Y;	
	final private ActiveStatus inActive = ActiveStatus.N;

    private Brands brand;
    private Items item;

    @BeforeEach
    void setUp() {
        brand = new Brands(1, "Hero", null, Active, null, null);
        item = new Items();
        item.setItemId(1L);
        item.setItemName("Chain");
        item.setItemType("Accessory");
        item.setPrice(new Double("500.00")); 
        item.setValidTo(new Date(2025-1900, 5, 7));
        item.setBrand(brand);
        item.setIsActive(Active);
        
        
    }

    @Test
    void testGetAllItems() {
        when(itemRepository.findByIsActive(Active)).thenReturn(Arrays.asList(item));

        List<Items> items = itemService.getAllItems();
        assertEquals(1, items.size());
        assertEquals("Chain", items.get(0).getItemName());
    }

    @Test
    void testCreateItem() {
        ItemRequest itemRequest = new ItemRequest();
        itemRequest.setItemName("Chain");
        itemRequest.setItemType("Accessory");
        itemRequest.setPrice(new Double("500.00"));
        itemRequest.setValidTo(new Date(2025-1900, 5, 7)); 
        itemRequest.setBrandName("Hero");

        when(brandRepository.findActiveBrand("Hero")).thenReturn(Optional.of(brand));
        when(itemRepository.save(any(Items.class))).thenReturn(item);

        ItemResponse response = itemService.createItem(itemRequest);
        assertEquals("Chain", response.getItemName());
        assertEquals("Accessory", response.getItemType());
    }


    @Test
    void testCreateItemBrandNotFound() {
    	ItemRequest itemRequest = new ItemRequest();
    	itemRequest.setItemName("Chain");
    	itemRequest.setItemType("Accessory");
    	itemRequest.setPrice(new Double("500.00"));
    	item.setValidTo(new Date(2025-1900, 5, 7));
        itemRequest.setBrandName("Atlas");
        when(brandRepository.findActiveBrand("Atlas")).thenReturn(Optional.empty());

        assertThrows(BrandNotFound.class, () -> itemService.createItem(itemRequest));
    }

    @Test
    void testGetItemById() {
        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));

        ItemResponse response = itemService.getItemById(1L);
        assertEquals("Chain", response.getItemName());
    }

    @Test
    void testGetItemByIdNotFound() {
        when(itemRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(ItemNotFound.class, () -> itemService.getItemById(2L));
    }

    @Test
    void testDeleteItem() {
        when(itemRepository.findById(1L)).thenReturn(Optional.of(item));

        itemService.deleteItem(1L);

        assertEquals("N", item.getIsActive());
        verify(itemRepository, times(1)).save(item);
    }

    @Test
    void testGetItemsByBrand() {
        when(brandRepository.findByBrandName("Hero")).thenReturn(Optional.of(brand));
        when(itemRepository.findActiveItemsByBrand("Hero")).thenReturn(Arrays.asList(item));

        List<ItemResponse> responses = itemService.getItemsByBrand("Hero");
        assertEquals(1, responses.size());
        assertEquals("Chain", responses.get(0).getItemName());
    }

    @Test
    void testGetItemsByBrandNotFound() {
        when(brandRepository.findByBrandName("Atlas")).thenReturn(Optional.empty());

        assertThrows(BrandNotFound.class, () -> itemService.getItemsByBrand("Atlas"));
    }
} 
