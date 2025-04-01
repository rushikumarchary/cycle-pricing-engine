package com.itrosys.cycle_engine.exception;

public class PaymentException extends RuntimeException {
    public PaymentException(String massage) {
        super(massage);
    }
}
