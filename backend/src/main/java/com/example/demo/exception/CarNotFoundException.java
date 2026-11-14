package com.example.demo.exception;

public class CarNotFoundException extends RuntimeException {
    public CarNotFoundException(Integer id) {
        super("Car with id " + id + " was not found");
    }
}
