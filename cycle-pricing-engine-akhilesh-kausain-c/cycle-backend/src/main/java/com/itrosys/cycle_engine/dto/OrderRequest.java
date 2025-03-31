package com.itrosys.cycle_engine.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OrderRequest {
    private int amount; // In INR

    public OrderRequest() {

    }

    public OrderRequest(int amount) {
        this.amount = amount;
    }

}
