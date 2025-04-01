package com.itrosys.cycle_engine.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemRequest {

    private String itemName;
    private String itemType;
    private BigDecimal price;

    private String validTo;
    private String brandName;
}
