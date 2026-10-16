import { useState } from 'react';
import CarForm from './CarForm';

export default function CarManagement({
  cars,
  onAddCar,
  onDeleteCar,
  onUpdateCar,
}) {
  const [editingCar, setEditingCar] = useState(null);

  function handleSave(car) {
    if (editingCar) {
      onUpdateCar(car);
      setEditingCar(null);
    } else {
      onAddCar(car);
    }
  }

  return (
    <section>
      <h1>Car Management</h1>
      <p>View, add, edit, and delete company cars.</p>

      <CarForm
        key={editingCar ? editingCar.id : 'new'}
        cars={cars}
        initialCar={editingCar}
        onSaveCar={handleSave}
        onCancel={() => setEditingCar(null)}
      />

      <div style={{ overflowX: 'auto', marginTop: '24px' }}>
        <table style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Brand</th>
              <th scope="col">Model</th>
              <th scope="col">Year</th>
              <th scope="col">Plate Number</th>
              <th scope="col">Color</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {cars.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  No cars yet. Use the form above to add a car.
                </td>
              </tr>
            ) : (
              cars.map((car) => (
                <tr key={car.id}>
                  <td>{car.id}</td>
                  <td>{car.brand}</td>
                  <td>{car.model}</td>
                  <td>{car.year}</td>
                  <td>{car.plateNumber}</td>
                  <td>{car.color}</td>
                  <td>{car.status}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => setEditingCar(car)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteCar(car.id)}
                      disabled={editingCar?.id === car.id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}