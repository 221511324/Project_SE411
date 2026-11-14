package com.example.demo.service;

import com.example.demo.exception.CarNotFoundException;
import com.example.demo.exception.CarValidationException;
import com.example.demo.model.Car;
import com.example.demo.model.CarRepository;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;

@Service
public class CarService {
    private final CarRepository repository;
    private final JdbcTemplate jdbcTemplate;

    public CarService(CarRepository repository, JdbcTemplate jdbcTemplate) {
        this.repository = repository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public Iterable<Car> findAll() {
        return repository.findAll();
    }

    public Car findById(Integer id) {
        return repository.findById(id).orElseThrow(() -> new CarNotFoundException(id));
    }

    public Car create(Car car) {
        validate(car);
        if (car.id() != null && repository.existsById(car.id())) {
            throw new CarValidationException("A car with id " + car.id() + " already exists");
        }
        Car normalized = normalize(car);
        jdbcTemplate.update("INSERT INTO CAR (ID, BRAND, MODEL, MODEL_YEAR, PLATE_NUMBER, COLOR, STATUS) VALUES (?, ?, ?, ?, ?, ?, ?)",
                normalized.id(), normalized.brand(), normalized.model(), normalized.year(), normalized.plateNumber(), normalized.color(), normalized.status());
        return normalized;
    }

    public Car update(Integer id, Car car) {
        findById(id);
        validate(car);
        return repository.save(new Car(id, car.brand(), car.model(), car.year(), car.plateNumber(), car.color(), car.status()));
    }

    private void validate(Car car) {
        if (car == null) throw new CarValidationException("Car data is required");
        if (car.id() == null || car.id() < 1) throw new CarValidationException("id must be a positive number");
        if (blank(car.brand()) || blank(car.model()) || blank(car.plateNumber()) || blank(car.color()) || blank(car.status())) {
            throw new CarValidationException("brand, model, plateNumber, color, and status are required");
        }
        if (car.year() == null || car.year() < 1886 || car.year() > java.time.Year.now().getValue() + 1) {
            throw new CarValidationException("year must be between 1886 and next year");
        }
        if (!car.status().equals("Available") && !car.status().equals("In Use") && !car.status().equals("Under Maintenance")) {
            throw new CarValidationException("status must be Available, In Use, or Under Maintenance");
        }
    }

    private Car normalize(Car car) {
        return new Car(car.id(), car.brand().trim(), car.model().trim(), car.year(), car.plateNumber().trim().toUpperCase(), car.color().trim(), car.status().trim());
    }

    private boolean blank(String value) { return value == null || value.trim().isEmpty(); }


public void delete(Integer id) {
    findById(id);
    repository.deleteById(id);
}
}