package com.example.cpe.exception;


public class ItemNotFound extends RuntimeException{
	
	
	private static final long serialVersionUID = 1L;

	public ItemNotFound(String message) {
		super(message);
	}

}
