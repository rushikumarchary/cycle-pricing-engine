package com.example.cpe.dto;



import java.util.Date;
//import jakarta.validation.constraints.NotBlank;
//import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ItemRequest {

    private String itemName;
    private String itemType;
    private Double price;
    private Date validTo; // Optional field
    private String brandName;
}