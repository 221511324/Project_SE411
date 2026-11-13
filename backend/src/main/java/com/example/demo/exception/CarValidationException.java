package com.example.demo.exception;

public class CarValidationException extends RuntimeException {
    public CarValidationException(String message) {
        super(message);
    }
}
