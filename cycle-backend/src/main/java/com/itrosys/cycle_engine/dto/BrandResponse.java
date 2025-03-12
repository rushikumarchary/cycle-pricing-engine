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
	
	
}
