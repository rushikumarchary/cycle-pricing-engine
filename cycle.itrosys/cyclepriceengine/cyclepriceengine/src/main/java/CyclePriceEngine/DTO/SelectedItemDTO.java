package CyclePriceEngine.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Data Transfer Object for item selection in pricing requests.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SelectedItemDTO {
    /**
     * Name of the item to be priced
     */
    private String itemName;

    /**
     * Quantity of items requested
     */
    private Long quantity;
}