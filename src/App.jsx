import { useState } from 'react';
import CarManagement from './CarManagement';

export default function App() {
  const [cars, setCars] = useState([
    {
      id: 'CAR-001',
      brand: 'Toyota',
      model: 'Camry',
      year: 2024,
      plateNumber: 'ABC 1234',
      color: 'White',
      status: 'Available',
    },
    {
      id: 'CAR-002',
      brand: 'Hyundai',
      model: 'Elantra',
      year: 2023,
      plateNumber: 'XYZ 5678',
      color: 'Silver',
      status: 'Under Maintenance',
    },
  ]);

  function deleteCar(id) {
  const confirmed = window.confirm(`Delete car ${id}?`);

  if (confirmed) {
    setCars((currentCars) =>
      currentCars.filter((car) => car.id !== id)
    );
  }
}

function addCar(newCar) {
  setCars((currentCars) => [...currentCars, newCar]);
}

function updateCar(updatedCar) {
  setCars((currentCars) =>
    currentCars.map((car) =>
      car.id === updatedCar.id ? updatedCar : car
    )
  );
}

  return (
  <CarManagement
  cars={cars}
  onAddCar={addCar}
  onDeleteCar={deleteCar}
  onUpdateCar={updateCar}
  />
  );
}