package com.example.cpe.services;

import java.util.List;

import com.example.cpe.dto.ItemRequest;
import com.example.cpe.dto.ItemResponse;
import com.example.cpe.entities.Items;

public interface ItemService {
	List<Items> getAllItems();
	ItemResponse getItemById(Long id);
    void deleteItem(Long id);
    public List<ItemResponse> getItemsByBrand(String brandName);
	ItemResponse createItem(ItemRequest itemRequest);
	ItemResponse updateItem(Long id, ItemRequest itemRequest);
	public ItemResponse updateItemPrice(Long id, Double newPrice);
	 public ItemResponse updateValidDate(String validTo, Long itemId);
}
