package com.SpringBatch.exception;


import java.io.Serial;

public class ItemNotFound extends  RuntimeException{
    @Serial
    private static final long serialVersionUID = 1L;

    public ItemNotFound(String message) {
        super(message);
    }
}

