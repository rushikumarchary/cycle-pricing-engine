package com.itrosys.cycle_engine.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CartRequest {


    private String brand;
    private List<Integer> itemIds;
    private String thumbnail;
    private int quantity;

}
