package com.example.demo.controller;

import com.example.demo.model.Car;
import com.example.demo.service.CarService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.Map;


@RestController
@RequestMapping("/api/v1/cars")
public class CarController {
    private final CarService service;

    public CarController(CarService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<Iterable<Car>> findAll() { return ResponseEntity.ok(service.findAll()); }

    @GetMapping("/page")
    public ResponseEntity<Page<Car>> findAllPaginated(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    return ResponseEntity.ok(service.findAllPaginated(page, size));
}

    @GetMapping("/{id}")
    public ResponseEntity<Car> findById(@PathVariable Integer id) { return ResponseEntity.ok(service.findById(id)); }

    @PostMapping
    public ResponseEntity<Car> create(@RequestBody Car car) { return ResponseEntity.status(HttpStatus.CREATED).body(service.create(car)); }

    @PutMapping("/{id}")
    public ResponseEntity<Car> update(@PathVariable Integer id, @RequestBody Car car) { return ResponseEntity.ok(service.update(id, car)); }

    @DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable Integer id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
}
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handle(RuntimeException exception) {
        HttpStatus status = exception.getClass().getSimpleName().equals("CarNotFoundException") ? HttpStatus.NOT_FOUND : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(Map.of("error", exception.getMessage()));
    }
}
