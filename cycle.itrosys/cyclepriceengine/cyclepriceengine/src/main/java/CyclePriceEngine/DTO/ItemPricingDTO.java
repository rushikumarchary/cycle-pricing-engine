package CyclePriceEngine.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Data Transfer Object for individual item pricing details.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemPricingDTO {
    /**
     * Name of the item
     */
    private String itemName;

    /**
     * Quantity of items requested
     */
    private Long quantity;

    /**
     * Price per unit
     */
    private BigDecimal unitPrice;

    /**
     * Total price (quantity * unitPrice)
     */
    private BigDecimal totalPrice;
}