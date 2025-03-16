package com.example.cpe.services.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.cpe.dto.ActiveStatus;
import com.example.cpe.dto.BrandResponse;
import com.example.cpe.entities.Brands;
import com.example.cpe.entities.Items;
import com.example.cpe.exception.BrandNotFound;
import com.example.cpe.exception.ItemNotFound;
import com.example.cpe.repository.BrandRepository;
import com.example.cpe.repository.ItemRepository;
import com.example.cpe.services.PricingService;


@Service
public class PricingServiceImpl implements PricingService {
    
	 final private BrandRepository brandRepository;
	    final private ItemRepository itemRepository;

	    public PricingServiceImpl(BrandRepository brandRepository,ItemRepository itemRepository) {
	        this.brandRepository = brandRepository;
	        this.itemRepository=itemRepository;
	    }

    private static final BigDecimal GST_RATE = BigDecimal.valueOf(0.18);
    private static final BigDecimal DISCOUNT_10 = BigDecimal.valueOf(0.10);
    private static final BigDecimal DISCOUNT_5 = BigDecimal.valueOf(0.05);

    
    public List<BrandResponse> getAllBrandsForCycle() {
        List<String> requiredItemTypes = List.of("Frame", "Handlebar", "Seating", "Wheel", "Brakes", "Tyre", "Chain Assembly");

        List<Brands> activeBrands = brandRepository.findAllActiveBrands();
        if (activeBrands.isEmpty()) {
            return Collections.emptyList();
        }

        List<Items> activeItems = itemRepository.findByBrandInAndIsActive(activeBrands, ActiveStatus.Y);

        // Creating a brand-to-itemType mapping
        Map<Integer, Set<String>> brandItemsMap = new HashMap<>();
        
        for (Items item : activeItems) {
            int brandId = item.getBrand().getBrandId();
            brandItemsMap.putIfAbsent(brandId, new HashSet<>());
            brandItemsMap.get(brandId).add(item.getItemType());
        }

        // Filtering brands based on required item types
        List<BrandResponse> result = new ArrayList<>();
        
        for (Brands brand : activeBrands) {
            Set<String> itemTypes = brandItemsMap.getOrDefault(brand.getBrandId(), Collections.emptySet());
            if (itemTypes.containsAll(requiredItemTypes)) {
                result.add(new BrandResponse(brand.getBrandId(), brand.getBrandName()));
            }
        }

        return result;
    }


    public List<BrandResponse> getAllBrands() {
        List<Brands> brands = brandRepository.findAll();
        List<BrandResponse> result = new ArrayList<>();

        for (Brands brand : brands) {
            if (brand.getIsActive() == ActiveStatus.Y) {
                result.add(new BrandResponse(brand.getBrandId(), brand.getBrandName()));
            }
        }

        return result;
    }

    public Map<String, List<Map<String, Object>>> getGroupedItemNameAndTypeByBrandName(int id) {
        Brands brand = brandRepository.findById(id)
                .orElseThrow(() -> new BrandNotFound("Brand with id '" + id + "' not found."));

        // Check if brand is inactive
        if (brand.getIsActive() == ActiveStatus.N) {
            throw new BrandNotFound("Brand with id '" + id + "' not Found");
        }

        // Fetch all items for the given brand
        List<Items> items = itemRepository.findByBrand(brand);

        // If no items are found, throw an exception
        if (items.isEmpty()) {
            throw new ItemNotFound("Items with Brand id '" + id + "' not found.");
        }

        // Group items by type
        Map<String, List<Map<String, Object>>> groupedItems = new HashMap<>();

        for (Items item : items) {
            if (item.getIsActive() == ActiveStatus.Y) { // Filter active items
                Map<String, Object> itemDetails = new HashMap<>();
                itemDetails.put("item_id", item.getItemId());
                itemDetails.put("item_name", item.getItemName());

                // Add to the grouped map
                groupedItems.computeIfAbsent(item.getItemType(), k -> new ArrayList<>()).add(itemDetails);
            }
        }

        return groupedItems;
    }

    @Override
    public Map<String, Object> calculatePrice(Map<String, Map<String, Object>> cycleConfig, Date pricingDate) {

        Map<String, BigDecimal> priceBreakup = new HashMap<>();
        List<String> expiredComponents = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (Map.Entry<String, Map<String, Object>> entry : cycleConfig.entrySet()) {
            String componentType = entry.getKey();
            String componentName = (String) entry.getValue().get("name");
            Integer brandId = (Integer) entry.getValue().get("brandId");
            Integer quantity = (Integer) entry.getValue().get("quantity");

            if (quantity == null || quantity <= 0) {
                quantity = 1;
            }

            List<Items> itemsList = itemRepository.findValidItems(componentName, componentType, brandId, pricingDate);

            System.out.println("Pricing Date: " + pricingDate);
            System.out.println("Current Java Timezone: " + ZoneId.systemDefault());
            System.out.println("Checking: " + componentType + " - " + componentName + " | Brand ID: " + brandId);

            for (Items item : itemsList) {
                System.out.println("Found: " + item.getItemName() + " | Brand ID: "  + " | Valid Until: " + item.getValidTo());
            }

            if (!itemsList.isEmpty()) {
                Items latestItem = itemsList.get(itemsList.size() - 1);
                BigDecimal itemPrice = BigDecimal.valueOf(latestItem.getPrice()).multiply(BigDecimal.valueOf(quantity));

                priceBreakup.put(componentType, itemPrice);
                totalPrice = totalPrice.add(itemPrice);
            } else {
                expiredComponents.add(componentType + " - " + componentName + " (Brand ID: " + brandId + ")");
            }
        }

        BigDecimal discount = (totalPrice.compareTo(BigDecimal.valueOf(5000)) > 0)
                ? totalPrice.multiply(DISCOUNT_10)
                : (totalPrice.compareTo(BigDecimal.valueOf(3000)) > 0)
                ? totalPrice.multiply(DISCOUNT_5)
                : BigDecimal.ZERO;
        BigDecimal priceAfterDiscount = totalPrice.subtract(discount);
        BigDecimal gstAmount = priceAfterDiscount.multiply(GST_RATE).setScale(2, RoundingMode.HALF_UP);

        BigDecimal finalPrice = priceAfterDiscount.add(gstAmount).setScale(2, RoundingMode.HALF_UP);

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("breakup", priceBreakup);
        response.put("totalPriceBeforeDiscount", totalPrice);
        response.put("discountApplied", discount.setScale(2, RoundingMode.HALF_UP));
        response.put("gstAmount", gstAmount);
        response.put("finalPrice", finalPrice);
         
        

        if (!expiredComponents.isEmpty()) {
            response.put("warning", "Some components have expired: " + expiredComponents);
        }

        return response;
    }
}
