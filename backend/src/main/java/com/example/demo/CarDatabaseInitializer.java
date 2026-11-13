package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class CarDatabaseInitializer implements CommandLineRunner {
    private final JdbcTemplate jdbcTemplate;

    public CarDatabaseInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS CAR (ID int PRIMARY KEY, BRAND varchar(100) NOT NULL, MODEL varchar(100) NOT NULL, MODEL_YEAR int NOT NULL, PLATE_NUMBER varchar(30) NOT NULL, COLOR varchar(50) NOT NULL, STATUS varchar(30) NOT NULL)");
        Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM CAR", Integer.class);
        if (count != null && count == 0) {
            jdbcTemplate.update("INSERT INTO CAR (ID, BRAND, MODEL, MODEL_YEAR, PLATE_NUMBER, COLOR, STATUS) VALUES (1, 'Toyota', 'Camry', 2024, 'ABC 1234', 'White', 'Available')");
            jdbcTemplate.update("INSERT INTO CAR (ID, BRAND, MODEL, MODEL_YEAR, PLATE_NUMBER, COLOR, STATUS) VALUES (2, 'Hyundai', 'Elantra', 2023, 'XYZ 5678', 'Silver', 'Under Maintenance')");
        }
    }
}
