package com.itrosys.cycle_engine.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import com.fasterxml.jackson.annotation.JsonInclude;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ItemResponse {

    private String message;
    private int itemId;
    private String itemName;
    private String itemType;
    private BigDecimal price;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Kolkata")
    private Date validTo;

    private String brandName;

    @JsonProperty("brandId")
    @JsonInclude(JsonInclude.Include.NON_DEFAULT)
    private int brandId;

}
