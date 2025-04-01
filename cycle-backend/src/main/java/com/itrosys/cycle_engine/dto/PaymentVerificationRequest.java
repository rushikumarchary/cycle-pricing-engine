package com.itrosys.cycle_engine.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PaymentVerificationRequest {
    private String orderId;
    private String paymentId;
    private String signature;

    public PaymentVerificationRequest() {}

    public PaymentVerificationRequest(String orderId, String paymentId, String signature) {
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.signature = signature;
    }

}
