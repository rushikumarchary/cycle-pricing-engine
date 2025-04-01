package com.itrosys.cycle_engine.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BrandResponse {

	private int id;
	private String name;
	private String message;

	public BrandResponse(){

	}

	public BrandResponse(int id, String name, String message) {
		this.id = id;
		this.name = name;
		this.message = message;
	}

	public 	BrandResponse(int brandId, String  bName){
		this.id=brandId;
		this.name=bName;

	}

	
	
}
