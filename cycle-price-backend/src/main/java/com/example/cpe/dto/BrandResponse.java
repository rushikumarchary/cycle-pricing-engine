package com.example.cpe.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BrandResponse {

	private int id;
	private String brandName;
	private String message;

	public BrandResponse(){

	}

	public BrandResponse(int id, String name, String message) {
		this.id = id;
		this.brandName = name;
		this.message = message;
	}

	public 	BrandResponse(int brandId, String  bName){
		this.id=brandId;
		this.brandName=bName;

	}

	
	
}
