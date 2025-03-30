package com.itrosys.cycle_engine.service;

import com.itrosys.cycle_engine.dto.ItemRequest;
import com.itrosys.cycle_engine.dto.ItemResponse;
import com.itrosys.cycle_engine.entity.Brand;
import com.itrosys.cycle_engine.entity.Item;
import com.itrosys.cycle_engine.enums.IsActive;
import com.itrosys.cycle_engine.exception.BrandNotFound;
import com.itrosys.cycle_engine.exception.InvalidDateFormat;
import com.itrosys.cycle_engine.exception.ItemNotFound;
import com.itrosys.cycle_engine.repository.BrandRepository;
import com.itrosys.cycle_engine.repository.ItemRepository;
import com.itrosys.cycle_engine.config.UserInfo;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final BrandRepository brandRepository;


    public ItemService(ItemRepository repository, BrandRepository brandRepository) {
        this.itemRepository = repository;
        this.brandRepository = brandRepository;

    }

    public ItemResponse addItem(ItemRequest itemRequest) {
        if (itemRequest.getItemName() == null || itemRequest.getItemName().trim().isEmpty()) {
            throw new IllegalArgumentException("Item name cannot be blank");
        }
        if (itemRequest.getItemType() == null || itemRequest.getItemType().trim().isEmpty()) {
            throw new IllegalArgumentException("Item type cannot be blank");
        }
        if (itemRequest.getPrice() == null) {
            throw new IllegalArgumentException("Price cannot be null");
        }
        if (itemRequest.getBrandName() == null || itemRequest.getBrandName().trim().isEmpty()) {
            throw new IllegalArgumentException("Brand name cannot be blank");
        }
        Date parsedDate = convertDate(itemRequest.getValidTo());

        // Fetch brand by name
        Brand brand = brandRepository.findByBrandName(itemRequest.getBrandName())
                .orElseThrow(() -> new BrandNotFound("Brand '" + itemRequest.getBrandName() + "' does not exist"));

//        Check if the brand is active
        if (brand.getIsActive() != IsActive.Y) {
            throw new BrandNotFound("Brand '" + itemRequest.getBrandName() + "' is not found.");
        }

//        Find if an item with the same itemName already exists for the brand
        Optional<Item> existingItem = itemRepository.findByItemNameAndBrand(itemRequest.getItemName(), brand);

        Item item;
        if (existingItem.isPresent()) {
            item = existingItem.get();
            item.setPrice(itemRequest.getPrice());
            item.setValidTo(parsedDate);
            item.setIsActive(IsActive.Y); // Reactivate if needed
        } else {
            // Create a new item only if no existing itemName found
            item = new Item();
            item.setItemName(itemRequest.getItemName());
            item.setItemType(itemRequest.getItemType());
            item.setPrice(itemRequest.getPrice());
            item.setValidTo(parsedDate);
            item.setBrand(brand);
            item.setIsActive(IsActive.Y);
        }

        item.setModifiedBy(UserInfo.getLoggedInUsername());
        Item savedItem = itemRepository.save(item);

        return mapToItemResponse(savedItem, "Item Add Successfully.");
    }


    


    public ItemResponse mapToItemResponse(Item item, String message) {
        return ItemResponse.builder()
                .message(message)
                .itemId(item.getItemId())
                .itemName(item.getItemName())
                .itemType(item.getItemType())
                .price(item.getPrice())
                .validTo(item.getValidTo())
                .brandId(item.getBrand().getBrandId())
                .brandName(item.getBrand().getBrandName())
                .build();
    }

    // Convert validTo String to Date
    private Date convertDate(String date) {
        // Convert validTo String to Date
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            return sdf.parse(date);
        } catch (ParseException e) {
            throw new InvalidDateFormat("Invalid date format. Use 'yyyy-MM-dd HH:mm:ss'");
        }

    }


//    public ItemResponse getItemById(int id) {
//
//        Item item = itemRepository.findById(id)
//                .orElseThrow(() -> new ItemNotFound("Item with id " + id + " not found"));
//
//        if (item.getIsActive() == IsActive.N || item.getBrand().getIsActive() == IsActive.N) {
//            throw new ItemNotFound("Item with ID " + id + " is not found ");
//        }
//
//
//        return mapToItemResponse(item, "Item Found Successfully.");
//    }

    public List<ItemResponse> getItemsByBrandName(String brandName) {

        // Fetch brand by name
        Brand brand = brandRepository.findByBrandName(brandName)
                .orElseThrow(() -> new BrandNotFound("Brand with name '" + brandName + "' not found."));

        // Check if brand is inactive
        if (brand.getIsActive() == IsActive.N) {
            throw new BrandNotFound("Brand '" + brandName + "' not found.");
        }

        // Fetch all items linked to the brand
        List<Item> items = itemRepository.findByBrand(brand);

        // If no items are found, throw an exception immediately
        if (items.isEmpty()) {
            throw new ItemNotFound("No items found for brand '" + brandName + "'.");
        }

        // Filter only active items (reassign to items)
        items = items.stream()
                .filter(item -> item.getIsActive() == IsActive.Y)
                .toList();

        // If no active items exist, throw exception
        if (items.isEmpty()) {
            throw new ItemNotFound("No active items found for brand '" + brandName + "'.");
        }

        // Convert List<Item> to List<ItemResponse>
        return items.stream()
                .map(item -> ItemResponse.builder()
                        .itemId(item.getItemId())
                        .itemName(item.getItemName())
                        .itemType(item.getItemType())
                        .price(item.getPrice())
                        .validTo(item.getValidTo())
                        .brandId(item.getBrand().getBrandId())
                        .brandName(item.getBrand().getBrandName()) // from Brand entity
                        .build())
                .toList();
    }


    public String deleteById(int id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFound("Item with Id " + id + " not found"));

        // Ensure the item itself is active before deletion
        if (item.getIsActive() != IsActive.Y) {
            throw new IllegalStateException("Item '" + item.getItemName() + "' is already inactive and cannot be deleted.");
        }

        String itemType = item.getItemType();
        String brandName = item.getBrand().getBrandName();
        String itemName = item.getItemName();

        // Check if another active item of the same type exists for the brand, excluding the current item
        boolean hasAnotherActiveItem = itemRepository.existsByItemTypeAndBrand_BrandNameAndIsActiveAndItemIdNot(
                itemType, brandName, IsActive.Y, id);

        if (!hasAnotherActiveItem) {
            throw new IllegalStateException("Item '" + itemName + "' is the only active item for item type '" + itemType +
                    "' in brand '" + brandName + "'. Deleting it will exclude the brand from cycle price estimation.");
        }

        // Mark item as inactive and update
        item.setIsActive(IsActive.N);
        item.setModifiedBy(UserInfo.getLoggedInUsername());
         itemRepository.save(item);

        return "Item Deleted successfully";
    }



    public void deleteItemById(int id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFound("Item with Id " + id + "  not found"));

        item.setIsActive(IsActive.N);
        item.setModifiedBy(UserInfo.getLoggedInUsername());

        itemRepository.save(item);


    }
    public ItemResponse updateItemDetails(int itemId, String validTo, BigDecimal price) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFound("Item with ID " + itemId + " not found"));

        if (validTo != null) {
            Date parsedDate = convertDate(validTo);
            item.setValidTo(parsedDate);
        }

        if (price != null) {
            item.setPrice(price);
        }

        item.setModifiedBy(UserInfo.getLoggedInUsername());
        Item savedItem = itemRepository.save(item);

        return ItemResponse.builder()
                .message("Item details updated successfully.")
                .itemId(savedItem.getItemId())
                .itemName(savedItem.getItemName())
                .itemType(savedItem.getItemType())
                .validTo(savedItem.getValidTo())
                .price(savedItem.getPrice())
                .build();
    }




    public ItemResponse updateItemPrice(int id, BigDecimal newPrice) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFound("Item not found with ID: " + id));
        item.setPrice(newPrice);
        item.setModifiedBy(UserInfo.getLoggedInUsername());
        // Update the item
        Item savedItem = itemRepository.save(item);
        return mapToItemResponse(savedItem, "Item Update Successfully.");

    }


    public ItemResponse updateValidDate(String validTo, int itemId) {
        // Convert the string into date
        Date parsedDate = convertDate(validTo);

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFound("Item with ID " + itemId + " not found"));

        item.setValidTo(parsedDate);
        item.setModifiedBy(UserInfo.getLoggedInUsername());
        Item savedItem = itemRepository.save(item);

        return ItemResponse.builder()
                .message("Item Valid Date and Time Updated Successfully.")
                .itemId(savedItem.getItemId())
                .itemName(savedItem.getItemName())
                .itemType(savedItem.getItemType())
                .validTo(savedItem.getValidTo())
                .build();
    }


    public ItemResponse makeItemActive(int itemId) {

        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFound("Item with Id : " + itemId + " not Found ..!"));

        if (item.getIsActive() == IsActive.Y) {
            throw new ItemNotFound("Item is All ready Active ..!");
        }
        item.setIsActive(IsActive.Y);
        item.setModifiedBy(UserInfo.getLoggedInUsername());
        Item savedItem = itemRepository.save(item);

        return mapToItemResponse(savedItem, "Item Activated Successfully ..!");
    }


}
