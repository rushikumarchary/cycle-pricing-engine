package CyclePriceEngine.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Data Transfer Object for pricing calculation requests.
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PricingRequestDTO {
    /**
     * Name of the brand for which pricing is requested
     */
    private String brandName;

    /**
     * List of items with their quantities
     */
    private List<SelectedItemDTO> items;

    /**
     * Date for which pricing is requested. If not provided, current date is used.
     */
    private LocalDateTime pricingDate;
}