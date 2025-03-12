package CyclePriceEngine.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object for pricing calculation response.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PricingResponseDTO {
    /**
     * Name of the brand for which pricing was calculated
     */
    private String brandName;

    /**
     * Date for which pricing was calculated
     */
    private LocalDateTime pricingDate;

    /**
     * List of items with their pricing details
     */
    private List<ItemPricingDTO> itemDetails;

    /**
     * Total amount for all items combined
     */
    private BigDecimal totalAmount;
}
