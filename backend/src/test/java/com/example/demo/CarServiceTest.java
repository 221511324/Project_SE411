
package com.example.demo;

import com.example.demo.service.CarService;
import com.example.demo.model.CarRepository;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CarServiceTest {

    @Test
    void findAllCarsTest() {
        CarRepository repository = mock(CarRepository.class);
        JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
        CarService service = new CarService(repository, jdbcTemplate);

        service.findAll();

        verify(repository).findAll();
    }

@Test
void findCarByIdTest() {
    CarRepository repository = mock(CarRepository.class);
    JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
    CarService service = new CarService(repository, jdbcTemplate);

    Integer carId = 1;

    when(repository.findById(carId))
        .thenReturn(java.util.Optional.empty());

    assertThrows(
        com.example.demo.exception.CarNotFoundException.class,
        () -> service.findById(carId)
    );

    verify(repository).findById(carId);
}

@Test
void addCarTest() {
    CarRepository repository = mock(CarRepository.class);
    JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
    CarService service = new CarService(repository, jdbcTemplate);

    com.example.demo.model.Car car = new com.example.demo.model.Car(
        1, "Toyota", "Camry", 2024,
        "ABC123", "White", "Available"
    );

    when(repository.existsById(1)).thenReturn(false);

    com.example.demo.model.Car result = service.create(car);

    assertEquals(1, result.id());
    assertEquals("Toyota", result.brand());
    assertEquals("Available", result.status());

    verify(jdbcTemplate).update(
        anyString(), eq(1), eq("Toyota"), eq("Camry"),
        eq(2024), eq("ABC123"), eq("White"), eq("Available")
    );
}

@Test
void updateCarTest() {
    CarRepository repository = mock(CarRepository.class);
    JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
    CarService service = new CarService(repository, jdbcTemplate);

    com.example.demo.model.Car car = new com.example.demo.model.Car(
        1, "Toyota", "Camry", 2024,
        "ABC123", "White", "Available"
    );

    when(repository.findById(1))
        .thenReturn(java.util.Optional.of(car));
    when(repository.save(any(com.example.demo.model.Car.class)))
        .thenAnswer(invocation -> invocation.getArgument(0));

    com.example.demo.model.Car result = service.update(1, car);

    assertEquals(1, result.id());
    assertEquals("Toyota", result.brand());
    verify(repository).save(any(com.example.demo.model.Car.class));
}

@Test
void invalidCarIdTest() {
    CarRepository repository = mock(CarRepository.class);
    JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
    CarService service = new CarService(repository, jdbcTemplate);

    com.example.demo.model.Car car = new com.example.demo.model.Car(
        -1, "Toyota", "Camry", 2024,
        "ABC123", "White", "Available"
    );

    assertThrows(
        com.example.demo.exception.CarValidationException.class,
        () -> service.create(car)
    );

    verifyNoInteractions(jdbcTemplate);
}

@Test
void duplicateCarIdTest() {
    CarRepository repository = mock(CarRepository.class);
    JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
    CarService service = new CarService(repository, jdbcTemplate);

    com.example.demo.model.Car car = new com.example.demo.model.Car(
        1, "Toyota", "Camry", 2024,
        "ABC123", "White", "Available"
    );

    when(repository.existsById(1)).thenReturn(true);

    assertThrows(
        com.example.demo.exception.CarValidationException.class,
        () -> service.create(car)
    );

    verify(repository).existsById(1);
    verifyNoInteractions(jdbcTemplate);
}

@Test
void deleteCarTest() {
    CarRepository repository = mock(CarRepository.class);
    JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
    CarService service = new CarService(repository, jdbcTemplate);

    com.example.demo.model.Car car = new com.example.demo.model.Car(
        1, "Toyota", "Camry", 2024,
        "ABC123", "White", "Available"
    );

    when(repository.findById(1))
        .thenReturn(java.util.Optional.of(car));

    service.delete(1);

    verify(repository).deleteById(1);
}

@Test
void paginationTest() {
    CarRepository repository = mock(CarRepository.class);
    JdbcTemplate jdbcTemplate = mock(JdbcTemplate.class);
    CarService service = new CarService(repository, jdbcTemplate);

    org.springframework.data.domain.PageRequest pageable =
            org.springframework.data.domain.PageRequest.of(0, 5);

    org.springframework.data.domain.Page<com.example.demo.model.Car> expected =
            org.springframework.data.domain.Page.empty(pageable);

    when(repository.findAll(pageable)).thenReturn(expected);

    var result = service.findAllPaginated(0, 5);

    assertEquals(expected, result);
    verify(repository).findAll(pageable);
}

}
