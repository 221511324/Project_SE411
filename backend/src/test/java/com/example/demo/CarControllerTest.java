
package com.example.demo;

import com.example.demo.controller.CarController;
import com.example.demo.service.CarService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CarControllerTest {

    @Test
    void findAllCarsTest() {
        CarService service = mock(CarService.class);
        CarController controller = new CarController(service);

        controller.findAll();

        verify(service).findAll();
    }

    @Test
    void findCarByIdTest() {
        CarService service = mock(CarService.class);
        CarController controller = new CarController(service);

        controller.findById(1);

        verify(service).findById(1);
    }

    @Test
    void deleteCarTest() {
        CarService service = mock(CarService.class);
        CarController controller = new CarController(service);

        var response = controller.delete(1);

        verify(service).delete(1);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

@Test
void createCarTest() {
    CarService service = mock(CarService.class);
    CarController controller = new CarController(service);

    com.example.demo.model.Car car =
        new com.example.demo.model.Car(
            1, "Toyota", "Camry", 2024,
            "ABC123", "White", "Available"
        );

    when(service.create(car)).thenReturn(car);

    var response = controller.create(car);

    assertEquals(HttpStatus.CREATED, response.getStatusCode());
    assertEquals(car, response.getBody());
    verify(service).create(car);
}

@Test
void updateCarTest() {
    CarService service = mock(CarService.class);
    CarController controller = new CarController(service);

    com.example.demo.model.Car car =
        new com.example.demo.model.Car(
            1, "Toyota", "Camry", 2024,
            "ABC123", "White", "Available"
        );

    when(service.update(1, car)).thenReturn(car);

    var response = controller.update(1, car);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(car, response.getBody());
    verify(service).update(1, car);
}

@Test
void paginationTest() {
    CarService service = mock(CarService.class);
    CarController controller = new CarController(service);

    var pageable = org.springframework.data.domain.PageRequest.of(0, 5);

    org.springframework.data.domain.Page<com.example.demo.model.Car> expected =
        org.springframework.data.domain.Page.empty(pageable);

    when(service.findAllPaginated(0, 5)).thenReturn(expected);

    var response = controller.findAllPaginated(0, 5);

    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(expected, response.getBody());
    verify(service).findAllPaginated(0, 5);
}

}
