package com.itrosys.cycle_engine.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Cycle {

	private String brand;
	private String tyre;
	private String wheel; 
	private String frame;
	private String seating;
	private String brakes;
	private String chainAssembly;
	private String handlebar;
	
}