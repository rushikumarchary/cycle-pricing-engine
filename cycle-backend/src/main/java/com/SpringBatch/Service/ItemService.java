package com.SpringBatch.Service;

import com.SpringBatch.Entity.Brand;
import com.SpringBatch.Entity.IsActiveStatus;
import com.SpringBatch.Entity.Item;
import com.SpringBatch.Repo.BrandRepository;
import com.SpringBatch.Repo.ItemRepository;
import com.SpringBatch.exception.ItemNotFound;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private BrandRepository brandRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }


    public List<Item> getAllActiveItems() {
        return itemRepository.findAllByIsActiveAndBrand_IsActive(IsActiveStatus.Y, IsActiveStatus.Y); // Fetch only active items
    }

    // Get Item by ID with Active Status Check
    public Item getItemById(Integer id) {
        Item items = itemRepository.findById(id)
                .orElseThrow(() -> new ItemNotFound("Item with id " + id + " not found"));

        if (IsActiveStatus.N.equals(items.getIsActive())) {
            throw new ItemNotFound("Item with ID " + id + " is not active ");
        }

        return items;
    }

    public Item createItem(Item item) {
        return itemRepository.save(item);
    }

    public Item updateItem(Integer id, Item itemDetails) {
        Optional<Item> optionalItem = itemRepository.findById(id);

        if (optionalItem.isPresent()) {
            Item existingItem = optionalItem.get();
            existingItem.setItemName(itemDetails.getItemName());
            existingItem.setItemType(itemDetails.getItemType());
            existingItem.setPrice(itemDetails.getPrice());
            existingItem.setValidTo(itemDetails.getValidTo());
            existingItem.setIsActive(itemDetails.getIsActive());
            existingItem.setModifiedBy(itemDetails.getModifiedBy());


            return itemRepository.save(existingItem); // ✅ Save updated item
        } else {
            throw new RuntimeException("Item not found with ID: " + id);
        }
    }

    public boolean deleteItem(int id) {
        if (itemRepository.existsById(id)) {
            itemRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
