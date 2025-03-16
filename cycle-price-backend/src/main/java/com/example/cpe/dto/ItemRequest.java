package com.example.cpe.dto;



import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ItemRequest {

    private String itemName;
    private String itemType;
    private Double price;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "UTC")
    private Date validTo; // Optional field
    private String brandName;
}