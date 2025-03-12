package com.example.cpe.services.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZoneId;
import java.util.*;
import org.springframework.stereotype.Service;
import com.example.cpe.entities.Items;
import com.example.cpe.repository.ItemRepository;
import com.example.cpe.services.PricingService;

@Service
public class PricingServiceImpl implements PricingService {
    
    final private ItemRepository itemRepository;
    public PricingServiceImpl(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    private static final BigDecimal GST_RATE = BigDecimal.valueOf(0.18);
    private static final BigDecimal DISCOUNT_10 = BigDecimal.valueOf(0.10);
    private static final BigDecimal DISCOUNT_5 = BigDecimal.valueOf(0.05);



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
