package CyclePriceEngine.DTO;

import CyclePriceEngine.Constants.Status;
import CyclePriceEngine.Entity.Item;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

@Data
@AllArgsConstructor  // Generates a constructor with all fields
@NoArgsConstructor   // Generates a no-arg constructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ItemDTO {
    private Long itemId;
    private String itemName;
    private String itemType;
    private BigDecimal price;
    private LocalDate validTo;
    private Long brandId;
    private Status status;
    private String updatedBy;


}

