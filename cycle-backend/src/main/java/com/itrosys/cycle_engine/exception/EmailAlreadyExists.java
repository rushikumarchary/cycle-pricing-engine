package com.itrosys.cycle_engine.exception;

public class EmailAlreadyExists extends RuntimeException{

    public EmailAlreadyExists(String massage){
        super(massage);
    }
}
