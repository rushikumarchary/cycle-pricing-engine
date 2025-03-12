package CyclePriceEngine.Repository;
import CyclePriceEngine.DTO.ItemWithBrandDTO;
import CyclePriceEngine.Entity.Brand;
import CyclePriceEngine.Entity.Item;
import CyclePriceEngine.Constants.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;
@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    // Get items by brand ID
    List<Item> findByBrandBrandId(Long brandId);

    // Get items by brand name with complete details
    @Query("SELECT i FROM Item i JOIN FETCH i.brand b WHERE LOWER(b.brandName) = LOWER(:brandName)")
    List<Item> findByBrand_BrandName(@Param("brandName") String brandName);

    // Fetch itemName and itemType by brand (Using DTO for better readability)
    @Query("SELECT i.itemName, i.itemType FROM Item i WHERE i.brand.brandId = :brandId")
    List<Object[]> getGroupedItemNameAndTypeByBrand(@Param("brandId") Long brandId);

    // Find items by type
    List<Item> findByItemType(String itemType);

    // Fetch items by brand and selected names (Only valid items)
//    @Query("SELECT i FROM Item i WHERE i.brand.brandName = :brandName AND i.itemName IN :selectedItems " +
//            "AND i.validTo >= CURRENT_DATE")
//    List<Item> findItemsByBrandAndNames(@Param("brandName") String brandName,
//                                        @Param("selectedItems") List<String> selectedItems);

    // Fetch items by brand and names with complete details
    @Query("SELECT DISTINCT i FROM Item i " +
           "JOIN FETCH i.brand b " +
           "WHERE LOWER(b.brandName) = LOWER(:brandName) " +
           "AND LOWER(i.itemName) IN (:itemNames)")
    List<Item> findItemsByBrandAndNames(@Param("brandName") String brandName, @Param("itemNames") List<String> itemNames);

    // Fetch all items with their brand names using DTO
    @Query("SELECT new CyclePriceEngine.DTO.ItemWithBrandDTO(i.itemName, i.brand.brandName) " +
            "FROM Item i")
    List<ItemWithBrandDTO> findAllItemsWithBrands();

    // Find items by multiple item names
    List<Item> findByItemNameIn(List<String> itemNames);

    // Find item by name
    Optional<Item> findByItemName(String itemName);
    @Query("SELECT i FROM Item i WHERE i.brand.id = :brandId AND i.status = 'Y' AND i.validTo >= CURRENT_DATE")
    List<Item> findValidItems(@Param("brandId") Long brandId);


    // Find valid items by item name, type, and brand (Fix: Use Long for brandId)
//    @Query("SELECT i FROM Item i WHERE i.itemName = :itemName AND i.itemType = :itemType " +
//            "AND i.brand.brandId = :brandId AND i.validTo >= :pricingDate ORDER BY i.validTo DESC")
//    List<Item> findValidItems(@Param("itemName") String itemName,
//                              @Param("itemType") String itemType,
//                              @Param("brandId") Long brandId,
//                              @Param("pricingDate") Date pricingDate);
}
