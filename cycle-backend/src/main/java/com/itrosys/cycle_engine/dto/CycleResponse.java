package com.itrosys.cycle_engine.dto;

import java.math.BigDecimal;
import java.util.Map;

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
public class CycleResponse {

	private String brand;
	private String tyre;
	private String wheel;
	private String frame;
	private String seating;
	private String brakes;
	private String chainAssembly;
	private String handlebar;
	private BigDecimal price;
	private BigDecimal gst;
	private BigDecimal discount;
	private BigDecimal totalPrice;
	// Breakdown of individual parts' prices
	private Map<String, BigDecimal> partsPrice;
}
