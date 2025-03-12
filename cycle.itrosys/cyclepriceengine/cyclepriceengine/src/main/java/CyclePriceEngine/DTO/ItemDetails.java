package CyclePriceEngine.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ItemDetails {
    private String itemType;
    private String itemName;
    private BigDecimal price;
    private LocalDate validTo;
}