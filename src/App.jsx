
import './App.css';
import { useEffect, useState } from 'react';
import CarManagement from './CarManagement';
import Dashboard from './Dashboard';
import About from './About';

const API_URL = '/api/v1/cars';

function formatCar(car) {
  return {
    ...car,
    id: `CAR-${String(car.id).padStart(3, '0')}`,
  };
}

function getNumericId(id) {
  return Number(String(id).replace(/^CAR-/i, ''));
}

async function fetchCars() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Failed to load cars.');
  }

  return response.json();
}

export default function App() {
  const [activePage, setActivePage] = useState('cars');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    fetchCars()
      .then((data) => {
        if (!ignore) {
          setCars(data.map(formatCar));
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err.message || 'Unable to connect to the server.');
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  async function loadCars() {
    setLoading(true);
    setError('');

    try {
      const data = await fetchCars();
      setCars(data.map(formatCar));
      return true;
    } catch (err) {
      setError(err.message || 'Unable to connect to the server.');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function addCar(newCar) {
    setError('');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCar,
          id: getNumericId(newCar.id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add car.');
      }

      return await loadCars();
    } catch (err) {
      setError(err.message || 'Failed to add car.');
      return false;
    }
  }

  async function updateCar(updatedCar) {
    setError('');

    try {
      const id = getNumericId(updatedCar.id);

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedCar,
          id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update car.');
      }

      return await loadCars();
    } catch (err) {
      setError(err.message || 'Failed to update car.');
      return false;
    }
  }

  async function deleteCar(car) {
    setError('');

    try {
      const id = getNumericId(car.id);

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete car.');
      }

      return await loadCars();
    } catch (err) {
      setError(err.message || 'Failed to delete car.');
      return false;
    }
  }

  return (
    <>
      <header>
        <p>
          <strong>Company Car Manager</strong>
        </p>

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
        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {activePage === 'dashboard' && (
          <Dashboard cars={cars} />
        )}

        {activePage === 'cars' && (
          loading ? (
            <p>Loading cars...</p>
          ) : (
            <CarManagement
              cars={cars}
              onAddCar={addCar}
              onUpdateCar={updateCar}
              onDeleteCar={deleteCar}
              onReloadCars={loadCars}
            />
          )
        )}

        {activePage === 'about' && <About />}
      </main>
    </>
  );
}
