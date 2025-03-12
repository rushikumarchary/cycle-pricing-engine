package com.example.cpe.dto;


import java.util.Date;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ItemResponse {

	private Long itemId;
	private String itemName;
	private String itemType;
	private Double price;
	private Date validTo;
	private String brandName;
	private int brandId;
}
