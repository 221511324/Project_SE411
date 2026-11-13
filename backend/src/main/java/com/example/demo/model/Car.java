package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;

@Table("CAR")
public record Car(
        @Id Integer id,
        String brand,
        String model,
        @Column("MODEL_YEAR") Integer year,
        String plateNumber,
        String color,
        String status
) {
}