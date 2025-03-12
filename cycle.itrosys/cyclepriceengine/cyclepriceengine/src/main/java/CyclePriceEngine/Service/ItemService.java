package CyclePriceEngine.Service;
import CyclePriceEngine.CyclepriceengineApplication;
import CyclePriceEngine.DTO.ItemDTO;
import CyclePriceEngine.DTO.ItemWithBrandDTO;
import CyclePriceEngine.Exception.ItemNotFoundException;

import CyclePriceEngine.Repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;


@Service
public class ItemService {

    private final ItemRepository itemRepository;


    @Autowired
    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;

    }
    public List<ItemDTO> getItemsByType(String type) {
        return itemRepository.findByItemType(type).stream()
                .map(item -> ItemDTO.builder()
                        .itemId(item.getItemId())
                        .itemName(item.getItemName())
                        .itemType(item.getItemType())
                        .build())
                .toList(); // Java 16+ optimization
    }



    public List<ItemDTO> getItemsByBrandName(String brandName) {
        return itemRepository.findByBrand_BrandName(brandName).stream()
                .map(item -> ItemDTO.builder()
                        .itemId(item.getItemId())
                        .itemName(item.getItemName())
                        .build())
                .toList(); // Efficient in Java 16+
    }


    public ItemDTO updateItem(Long itemId, ItemDTO updatedItemDTO) {
        return itemRepository.findById(itemId)
                .map(existingItem -> {
                    existingItem.setItemName(updatedItemDTO.getItemName());
                    existingItem.setItemType(updatedItemDTO.getItemType());
                    existingItem.setPrice(updatedItemDTO.getPrice());

                    return ItemDTO.builder()
                            .itemId(existingItem.getItemId())
                            .itemName(existingItem.getItemName())
                            .itemType(existingItem.getItemType())
                            .build();
                }).orElseThrow(() -> new ItemNotFoundException("Item not found with ID: " + itemId));
    }


    public Map<String, List<String>> getGroupedItemNameAndTypeByBrand(Long brandId) {
        List<Object[]> results = itemRepository.getGroupedItemNameAndTypeByBrand(brandId);
        return results.stream()
                .collect(Collectors.groupingBy(
                        obj -> (String) obj[0],  // Item name
                        Collectors.mapping(obj -> (String) obj[1], Collectors.toList()) // Item type
                ));
    }

    public List<ItemDTO> getAllItems() {
        return itemRepository.findAll().stream()
                .map(item -> ItemDTO.builder()
                        .itemId(item.getItemId())
                        .itemName(item.getItemName())
                        .itemType(item.getItemType())
                        .price(item.getPrice())
                        .brandId(item.getBrand() != null ? item.getBrand().getBrandId() : null)
                        .validTo(item.getValidTo())
                        .status(item.getStatus())
                        .updatedBy(item.getUpdatedBy())
                        .build()
                )
                .toList(); // Java 16+ optimization
    }


    public List<ItemWithBrandDTO> getAllItemsWithBrands() {
        List<ItemWithBrandDTO> items = itemRepository.findAllItemsWithBrands();
        return items == null ? Collections.emptyList() : items;
    }

    public Optional<ItemDTO> getItemById(Long id) {
        return itemRepository.findById(id)
                .map(item -> ItemDTO.builder()
                        .itemName(item.getItemName())
                        .itemType(item.getItemType())
                        .price(item.getPrice())
                        .validTo(item.getValidTo())
                        .brandId(item.getBrand() != null ? item.getBrand().getBrandId() : null)
                        .status(item.getStatus())
                        .updatedBy(item.getUpdatedBy())
                        .build()
                );
    }

    public void deleteItemById(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new ItemNotFoundException("Item with ID " + id + " not found!");
        }
        itemRepository.deleteById(id);
    }

}
