package CyclePriceEngine.Service;

import CyclePriceEngine.Repository.BrandRepository;
import CyclePriceEngine.Repository.ItemRepository;
import CyclePriceEngine.Entity.Item;
import CyclePriceEngine.DTO.*;
import CyclePriceEngine.Constants.Status;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PricingService {
    private final BrandRepository brandRepository;
    private final ItemRepository itemRepository;

    public PricingService(BrandRepository brandRepository, ItemRepository itemRepository) {
        this.brandRepository = brandRepository;
        this.itemRepository = itemRepository;
    }

    public PricingResponseDTO calculatePricing(PricingRequestDTO request) {
        validateRequest(request);
        
        // Fetch all requested items
        List<Item> items = fetchAndValidateItems(request);
        
        // Calculate item-wise pricing
        List<ItemPricingDTO> itemPricingList = calculateItemPricing(request.getItems(), items);
        
        // Calculate total amount
        BigDecimal totalAmount = calculateTotalAmount(itemPricingList);

        return PricingResponseDTO.builder()
                .brandName(request.getBrandName())
                .pricingDate(request.getPricingDate())
                .itemDetails(itemPricingList)
                .totalAmount(totalAmount)
                .build();
    }

    private void validateRequest(PricingRequestDTO request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Item list cannot be empty.");
        }

        if (!brandRepository.findByBrandName(request.getBrandName()).isPresent()) {
            List<String> availableBrands = brandRepository.findAllBrandNames();
            throw new IllegalArgumentException(
                String.format("Brand '%s' not found. Available brands: %s",
                    request.getBrandName(),
                    String.join(", ", availableBrands)));
        }
    }

    private List<Item> fetchAndValidateItems(PricingRequestDTO request) {
        List<String> itemNames = request.getItems().stream()
                .map(SelectedItemDTO::getItemName)
                .collect(Collectors.toList());

        List<Item> items = itemRepository.findItemsByBrandAndNames(request.getBrandName(), itemNames);

        if (items.isEmpty()) {
            List<Item> allBrandItems = itemRepository.findByBrand_BrandName(request.getBrandName());
            String availableItems = allBrandItems.stream()
                    .map(Item::getItemName)
                    .distinct()
                    .collect(Collectors.joining(", "));
            
            throw new IllegalArgumentException(
                String.format("No valid items found for brand '%s' and items %s. Available items: %s",
                    request.getBrandName(), itemNames, availableItems));
        }

        validateItemsStatus(items);
        return items;
    }

    private void validateItemsStatus(List<Item> items) {
        LocalDate currentDate = LocalDate.now();
        
        for (Item item : items) {
            if (item.getStatus() == null) {
                throw new IllegalArgumentException(
                    String.format("Item %s has no status set", item.getItemName()));
            }
            if (item.getValidTo() == null) {
                throw new IllegalArgumentException(
                    String.format("Item %s has no validity date set", item.getItemName()));
            }
            if (item.getPrice() == null) {
                throw new IllegalArgumentException(
                    String.format("Item %s has no price set", item.getItemName()));
            }
            if (!Status.Y.equals(item.getStatus())) {
                throw new IllegalArgumentException(
                    String.format("Item %s is inactive", item.getItemName()));
            }
            if (item.getValidTo().isBefore(currentDate)) {
                throw new IllegalArgumentException(
                    String.format("Item %s has expired (Valid until: %s)", 
                        item.getItemName(), item.getValidTo()));
            }
        }
    }

    private List<ItemPricingDTO> calculateItemPricing(List<SelectedItemDTO> requestedItems, List<Item> availableItems) {
        return requestedItems.stream().map(selectedItem -> {
            Item dbItem = availableItems.stream()
                    .filter(i -> i.getItemName().equalsIgnoreCase(selectedItem.getItemName()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException(
                        String.format("Item not found: %s", selectedItem.getItemName())));

            BigDecimal totalPrice = dbItem.getPrice().multiply(BigDecimal.valueOf(selectedItem.getQuantity()));

            return ItemPricingDTO.builder()
                    .itemName(dbItem.getItemName())
                    .quantity(selectedItem.getQuantity())
                    .unitPrice(dbItem.getPrice())
                    .totalPrice(totalPrice)
                    .build();
        }).collect(Collectors.toList());
    }

    private BigDecimal calculateTotalAmount(List<ItemPricingDTO> itemPricingList) {
        return itemPricingList.stream()
                .map(ItemPricingDTO::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}