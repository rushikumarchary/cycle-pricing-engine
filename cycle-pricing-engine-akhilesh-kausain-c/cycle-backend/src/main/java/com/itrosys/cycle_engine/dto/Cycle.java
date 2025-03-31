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
	private int brandId;
	private int tyreItemId;
	private int wheelItemId;
	private int frameItemId;
	private int seatingItemId;
	private int brakesItemId;
	private int chainAssemblyItemId;
	private int handlebarItemId;

}