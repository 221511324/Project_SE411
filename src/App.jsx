import './App.css';
import { useState } from 'react';
import CarManagement from './CarManagement';
import Dashboard from './Dashboard';
import About from './About';

export default function App() {
  const [activePage, setActivePage] = useState('cars');

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

  function deleteCar(id) {
    const confirmed = window.confirm(`Delete car ${id}?`);

    if (confirmed) {
      setCars((currentCars) =>
        currentCars.filter((car) => car.id !== id)
      );
    }
  }

  return (
    <>
      <header>
        <p><strong>Company Car Manager</strong></p>

        <nav
          aria-label="Main navigation"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <button
            type="button"
            aria-current={activePage === 'dashboard' ? 'page' : undefined}
            onClick={() => setActivePage('dashboard')}
          >
            Dashboard
          </button>

          <button
            type="button"
            aria-current={activePage === 'cars' ? 'page' : undefined}
            onClick={() => setActivePage('cars')}
          >
            Car Management
          </button>

          <button
            type="button"
            aria-current={activePage === 'about' ? 'page' : undefined}
            onClick={() => setActivePage('about')}
          >
            About
          </button>
        </nav>
      </header>

      <main>
        {activePage === 'dashboard' && <Dashboard cars={cars} />}

        {activePage === 'cars' && (
          <CarManagement
            cars={cars}
            onAddCar={addCar}
            onDeleteCar={deleteCar}
            onUpdateCar={updateCar}
          />
        )}

        {activePage === 'about' && <About />}
      </main>
    </>
  );
}