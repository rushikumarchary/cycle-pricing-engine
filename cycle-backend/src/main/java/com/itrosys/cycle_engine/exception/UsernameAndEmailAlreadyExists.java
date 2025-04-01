package com.itrosys.cycle_engine.exception;

public class UsernameAndEmailAlreadyExists extends  RuntimeException{

    public UsernameAndEmailAlreadyExists(String massage){
        super(massage);
    }
}
