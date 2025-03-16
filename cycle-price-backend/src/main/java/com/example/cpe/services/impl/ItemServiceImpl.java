package com.example.cpe.services.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.cpe.config.SecurityUtil;
import com.example.cpe.dto.ActiveStatus;
import com.example.cpe.dto.ItemRequest;
import com.example.cpe.dto.ItemResponse;
import com.example.cpe.entities.Brands;
import com.example.cpe.entities.Items;
import com.example.cpe.exception.BrandNotFound;
import com.example.cpe.exception.InvalidDateFormat;
import com.example.cpe.exception.ItemNotFound;
import com.example.cpe.repository.BrandRepository;
import com.example.cpe.repository.ItemRepository;
import com.example.cpe.services.ItemService;


@Service
public class ItemServiceImpl implements ItemService {

	final private ItemRepository itemRepository;
	final private BrandRepository brandRepository;

	public ItemServiceImpl(ItemRepository repository,BrandRepository brandRepository) {
		this.itemRepository = repository;
		this.brandRepository= brandRepository;
	}
	

	
    // Get all active items
	@Override
	public List<Items> getAllItems() {
	    return itemRepository.findAllActiveItems(); // Fetch active items
	}


    // Create a new item with brand validation
    @Override
    public ItemResponse createItem(ItemRequest itemRequest) {
        // Fetch active brand from DB or throw exception if not found
        Brands brand = brandRepository.findActiveBrand(itemRequest.getBrandName())
                .orElseThrow(() -> new BrandNotFound("Brand '" + itemRequest.getBrandName() + "' is not active or does not exist"));

        // Map Request to Entity
        Items item = new Items();
        item.setItemName(itemRequest.getItemName());
        item.setItemType(itemRequest.getItemType());
        item.setPrice(itemRequest.getPrice());
        item.setValidTo(itemRequest.getValidTo());
        item.setBrand(brand);
        item.setIsActive(ActiveStatus.Y); // Default Active
        item.setModifiedBy(SecurityUtil.getLoggedInUsername()); // Set ModifiedBy with logged-in user

        // Save Item to DB
        Items savedItem = itemRepository.save(item);

        return mapToItemResponse(savedItem); // Return Mapped Response
    }

    // Get Item by ID with Active Status Check
    @Override
    public ItemResponse getItemById(Long id) {
        Items items = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFound("Item with id " + id + " not found"));

        if (ActiveStatus.N.equals(items.getIsActive())) {
            throw new ItemNotFound("Item with ID " + id + " is not active ");
        }

        return mapToItemResponse(items);
    }

    // Update Item by ID with Active Check
    @Override
    public ItemResponse updateItem(Long id, ItemRequest itemRequest) {
        Items existingItem = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFound("Item with id " + id + " not found"));

        if (!ActiveStatus.Y.equals(existingItem.getIsActive())) {
            throw new ItemNotFound("Item with ID " + id + " is not active. Update is not allowed.");
        }

        // Update Item Fields
        existingItem.setItemName(itemRequest.getItemName());
        existingItem.setItemType(itemRequest.getItemType());
        existingItem.setPrice(itemRequest.getPrice());
        existingItem.setValidTo(itemRequest.getValidTo());

        Items updatedItem = itemRepository.save(existingItem); // Save updated Item

        return mapToItemResponse(updatedItem);
    }

    // Soft Delete Item by Setting isActive to 'N'
    @Override
    public void deleteItem(Long id) {
        Optional<Items> item = itemRepository.findById(id);
        if (item.isPresent()) {
            Items deleteItem = item.get();
            deleteItem.setModifiedBy(SecurityUtil.getLoggedInUsername()); // Set ModifiedBy with logged-in user
            deleteItem.setIsActive(ActiveStatus.N); // Soft Delete by setting isActive to 'N'
            itemRepository.save(deleteItem);
        }
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

    public ItemResponse updateItemPrice(Long id, Double newPrice) {
        Items item = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFound("Item not found with ID: " + id));
        item.setPrice(newPrice);
        item.setModifiedBy(SecurityUtil.getLoggedInUsername());
        // Update the item
        Items savedItem = itemRepository.save(item);
        return mapToItemResponse(savedItem);

    }


    public ItemResponse updateValidDate(String validTo, Long itemId) {
        // Convert the string into date
        Date parsedDate = convertDate(validTo);

        Items item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ItemNotFound("Item with ID " + itemId + " not found"));

        item.setValidTo(parsedDate);
        item.setModifiedBy(SecurityUtil.getLoggedInUsername());
        Items savedItem = itemRepository.save(item);

        return ItemResponse.builder()
                .itemId(savedItem.getItemId())
                .itemName(savedItem.getItemName())
                .itemType(savedItem.getItemType())
                .validTo(savedItem.getValidTo())
                .build();
    }


    // Get Items by Brand Name
    @Override
    public List<ItemResponse> getItemsByBrand(String brandName) {
        Brands brand = brandRepository.findByBrandName(brandName)
                .orElseThrow(() -> new BrandNotFound("Brand with name '" + brandName + "' not found."));

        if (ActiveStatus.N.equals(brand.getIsActive())) {
            throw new BrandNotFound("Brand '" + brandName + "' is inactive.");
        }

        List<Items> items = itemRepository.findActiveItemsByBrand(brandName);

        if (items.isEmpty()) {
            throw new ItemNotFound("No items found for brand '" + brandName + "'.");
        }

        return items.stream()
                .map(this::mapToItemResponse) // Convert Items to ItemResponse
                .collect(Collectors.toList());
    }

    // Map Entity to DTO Response
    public ItemResponse mapToItemResponse(Items items) {
        return ItemResponse.builder()
                .itemId(items.getItemId())
                .itemName(items.getItemName())
                .itemType(items.getItemType())
                .price(items.getPrice())
                .validTo(items.getValidTo())
                .brandId(items.getBrand().getBrandId())
                .brandName(items.getBrand().getBrandName())
                .build();
    }
}
