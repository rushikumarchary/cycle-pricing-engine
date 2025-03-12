package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.BrandResponse;
import com.itrosys.cycle_engine.dto.Cycle;
import com.itrosys.cycle_engine.dto.CycleResponse;
import com.itrosys.cycle_engine.entity.Brand;
import com.itrosys.cycle_engine.entity.Item;
import com.itrosys.cycle_engine.enums.IsActive;
import com.itrosys.cycle_engine.exception.BrandNotFound;
import com.itrosys.cycle_engine.exception.ItemNotFound;
import com.itrosys.cycle_engine.repository.BrandRepository;
import com.itrosys.cycle_engine.repository.ItemRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CycleService {


    private final ItemRepository itemRepository;
    private final BrandRepository brandRepository;

    public CycleService(ItemRepository itemRepository, BrandRepository brandRepository) {
        this.itemRepository = itemRepository;
        this.brandRepository = brandRepository;
    }

    public List<BrandResponse> getAllBrands() {
        List<Brand> brands = brandRepository.findAll();
        brands = brands.stream()
                .filter(brand -> brand.getIsActive() == IsActive.Y)
                .toList();

        return brands.stream()
                .map(brand -> BrandResponse.builder()
                        .id(brand.getBrandId())
                        .name(brand.getBrandName())
                        .build())
                .toList();
    }

    public Map<String, List<Map<String, Object>>> getGroupedItemNameAndTypeByBrandName(String brandName) {
        Brand brand = brandRepository.findByBrandName(brandName)
                .orElseThrow(() -> new BrandNotFound("Brand with name '" + brandName + "' not found."));

        // Check if brand is inactive
        if (brand.getIsActive() == IsActive.N) {
            throw new BrandNotFound("Brand  with name'" + brandName + "' not Found");
        }
        // Fetch all active items for the given brand
        List<Item> items = itemRepository.findByBrand(brand);

        // If no items are found, throw an exception
        if (items.isEmpty()) {
            throw new ItemNotFound("Items with Brand name '" + brandName + "' not found.");
        }

        // Filter only active items and map them into a structured response
        return items.stream()
                .filter(item -> item.getIsActive() == IsActive.Y)  //filter the active items
                .collect(Collectors.groupingBy(Item::getItemType,              // group the item by type
                        Collectors.mapping(item -> {                       // convert each item into map
                            Map<String, Object> itemDetails = new HashMap<>();  // crate map object to hold id and name
                            itemDetails.put("item_id", item.getItemId());         // this line get item id
                            itemDetails.put("item_name", item.getItemName());       // this getting item name
                            return itemDetails;                                // return into item type
                        }, Collectors.toList())
                ));
    }

    private void validateCycleInput(Cycle cycle) {
        if (cycle.getBrand() == null || cycle.getTyre() == null || cycle.getWheel() == null ||
                cycle.getFrame() == null || cycle.getSeating() == null || cycle.getBrakes() == null ||
                cycle.getChainAssembly() == null || cycle.getHandlebar() == null) {
            throw new IllegalArgumentException("All cycle parts must be provided. None can be null.");
        }
    }


    public CycleResponse calculateTotalPrice(Cycle cycle) {
        // Validate that all cycle attributes are non-null
        validateCycleInput(cycle);

        // Validate if the brand exists and is active
        Brand brand = brandRepository.findByBrandName(cycle.getBrand())
                .orElseThrow(() -> new BrandNotFound("Brand '" + cycle.getBrand() + "' not found."));

        if (brand.getIsActive() != IsActive.Y) {
            throw new BrandNotFound("Brand with name '" + cycle.getBrand() + "' not found.");
        }

        //  Get selected cycle parts
        List<String> selectedItems = Arrays.asList(cycle.getTyre(), cycle.getWheel(), cycle.getFrame(),
                cycle.getSeating(), cycle.getBrakes(),
                cycle.getChainAssembly(), cycle.getHandlebar());

        //Fetch item details from the database
        List<Item> items = itemRepository.findItemsByBrandAndNames(cycle.getBrand(), selectedItems);

        // Validate if all items exist and are active
        if (items.size() != selectedItems.size()) {
            throw new ItemNotFound("Some cycle parts were not found for brand: " + cycle.getBrand());
        }
        // not required but cross-check
        for (Item item : items) {
            if (item.getIsActive() != IsActive.Y) {
                throw new ItemNotFound("Item '" + item.getItemName() + "' is not found.");
            }
        }

        // Calculate total base price
        Map<String, BigDecimal> partsPrice = new LinkedHashMap<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (Item item : items) {
            partsPrice.put(item.getItemName(), item.getPrice()); // Store item price
            totalPrice = totalPrice.add(item.getPrice());
        }

        // Apply 5% discount
        BigDecimal discount = totalPrice.multiply(BigDecimal.valueOf(0.05)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal discountedPrice = totalPrice.subtract(discount);

        //  Calculate GST (18% on discounted price)
        BigDecimal gst = discountedPrice.multiply(BigDecimal.valueOf(0.18)).setScale(2, RoundingMode.HALF_UP);

        //  Calculate final total price after discount and GST
        BigDecimal finalTotalPrice = discountedPrice.add(gst);

        //  Return response with price details
        return CycleResponse.builder()
                .brand(cycle.getBrand())
                .tyre(cycle.getTyre())
                .wheel(cycle.getWheel())
                .frame(cycle.getFrame())
                .seating(cycle.getSeating())
                .brakes(cycle.getBrakes())
                .chainAssembly(cycle.getChainAssembly())
                .handlebar(cycle.getHandlebar())
                .price(totalPrice)
                .discount(discount)
                .gst(gst)
                .totalPrice(finalTotalPrice)
                .partsPrice(partsPrice)
                .build();
    }


    
}
