import { useState } from 'react';
import CarForm from './CarForm';

// These filenames must match the files in public/images.
const carPhotos = {
  'toyota camry': '/images/2020-Toyota-Camry-Super-White.png.avif',
  'hyundai elantra': 'public/images/images.jpeg',
};

function CarPhoto({ car }) {
  const [failed, setFailed] = useState(false);
  const photo = carPhotos[`${car.brand} ${car.model}`.toLowerCase()];

  if (!photo || failed) {
    return (
      <div className="fleet-photo-placeholder">
        <span aria-hidden="true">🚘</span>
        <span>Photo not available</span>
      </div>
    );
  }

  return (
    <img
      className="fleet-photo"
      src={photo}
      alt={`${car.brand} ${car.model}`}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

function StatusBadge({ status }) {
  const statusClass = {
    Available: 'available',
    'In Use': 'in-use',
    'Under Maintenance': 'maintenance',
  }[status];

  return (
    <span className={`fleet-status fleet-status--${statusClass || 'unknown'}`}>
      {status}
    </span>
  );
}

export default function CarManagement({
  cars,
  onAddCar,
  onDeleteCar,
  onUpdateCar,
}) {
  const [editingCar, setEditingCar] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
const [view, setView] = useState('cards');
  const brands = [...new Set(cars.map((car) => car.brand))].sort();

  const visibleCars = cars.filter((car) => {
    const searchableText =
      `${car.id} ${car.brand} ${car.model} ${car.plateNumber}`.toLowerCase();

    return (
      searchableText.includes(search.trim().toLowerCase()) &&
      (statusFilter === 'All' || car.status === statusFilter) &&
      (brandFilter === 'All' || car.brand === brandFilter)
    );
  });

  function handleSave(car) {
    if (editingCar) {
      onUpdateCar(car);
      setEditingCar(null);
    } else {
      onAddCar(car);
    }
  }

  function startEditing(car) {
    setEditingCar(car);
    document.getElementById('fleet-form')?.scrollIntoView({
      block: 'start',
    });
  }

  function resetFilters() {
    setSearch('');
    setStatusFilter('All');
    setBrandFilter('All');
  }

  function renderActions(car) {
    return (
      <div className="fleet-actions">
        <button
          type="button"
          className="fleet-edit"
          onClick={() => startEditing(car)}
        >
          Edit
        </button>

        <button
          type="button"
          className="fleet-delete"
          onClick={() => onDeleteCar(car.id)}
          disabled={editingCar?.id === car.id}
        >
          Delete
        </button>
      </div>
    );
  }

  return (
    <section className="fleet-page">
      <div className="fleet-page-heading">
        <div>
          <span className="fleet-eyebrow">YOUR COMPANY FLEET</span>
          <h1>Car Management</h1>
          <p>View, add, edit, and delete company cars.</p>
        </div>

        <span className="fleet-total">{cars.length} cars in your fleet</span>
      </div>

      <div id="fleet-form">
        <CarForm
          key={editingCar ? editingCar.id : 'new'}
          cars={cars}
          initialCar={editingCar}
          onSaveCar={handleSave}
          onCancel={() => setEditingCar(null)}
        />
      </div>

      <div className="fleet-workspace">
        <aside className="fleet-filters" aria-label="Car filters">
          <div className="fleet-filter-heading">
            <h2>Filter cars</h2>
            <button
              type="button"
              className="fleet-reset"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>

          <label htmlFor="fleet-search">Search cars</label>
          <input
            id="fleet-search"
            type="search"
            placeholder="Brand, model, ID or plate"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <label htmlFor="fleet-brand">Filter by brand</label>
          <select
            id="fleet-brand"
            value={brandFilter}
            onChange={(event) => setBrandFilter(event.target.value)}
          >
            <option value="All">All brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <label htmlFor="fleet-status">Filter by status</label>
          <select
            id="fleet-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All statuses</option>
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Under Maintenance">Under Maintenance</option>
          </select>

          <div className="fleet-filter-note">
            Find the right car by combining search, brand, and status.
          </div>
        </aside>

        <div className="fleet-results">
          <div className="fleet-toolbar">
            <p aria-live="polite">
              <strong>{visibleCars.length}</strong> of {cars.length} cars
            </p>

            <div className="fleet-view-switch" role="group" aria-label="View">
              <button
                type="button"
                aria-pressed={view === 'cards'}
                onClick={() => setView('cards')}
              >
                Cards
              </button>
              <button
                type="button"
                aria-pressed={view === 'table'}
                onClick={() => setView('table')}
              >
                Table
              </button>
            </div>
          </div>

          {view === 'cards' ? (
            visibleCars.length > 0 ? (
              <div className="fleet-card-grid">
                {visibleCars.map((car) => (
                  <article className="fleet-car-card" key={car.id}>
                    <div className="fleet-card-heading">
                      <div>
                        <h2>{car.brand} {car.model}</h2>
                        <span className="fleet-car-id">{car.id}</span>
                      </div>
                      <StatusBadge status={car.status} />
                    </div>

                    <CarPhoto
                      key={`${car.brand}-${car.model}`}
                      car={car}
                    />

                    <dl className="fleet-specs">
                      <div>
                        <dt>Year</dt>
                        <dd>{car.year}</dd>
                      </div>
                      <div>
                        <dt>Color</dt>
                        <dd>{car.color}</dd>
                      </div>
                      <div>
                        <dt>Plate number</dt>
                        <dd>{car.plateNumber}</dd>
                      </div>
                    </dl>

                    {renderActions(car)}
                  </article>
                ))}
              </div>
            ) : (
              <p className="fleet-empty">
                {cars.length === 0
                  ? 'No cars yet. Use the form above to add a car.'
                  : 'No cars match your filters. Try resetting them.'}
              </p>
            )
          ) : (
            <div className="fleet-table-wrapper">
              <table>
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
                  {visibleCars.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        {cars.length === 0
                          ? 'No cars yet. Use the form above to add a car.'
                          : 'No cars match your filters. Try resetting them.'}
                      </td>
                    </tr>
                  ) : (
                    visibleCars.map((car) => (
                      <tr key={car.id}>
                        <td>{car.id}</td>
                        <td>{car.brand}</td>
                        <td>{car.model}</td>
                        <td>{car.year}</td>
                        <td>{car.plateNumber}</td>
                        <td>{car.color}</td>
                        <td><StatusBadge status={car.status} /></td>
                        <td>{renderActions(car)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}