
import { useState } from 'react';
import CarForm from './CarForm';

const carPhotos = {
  'toyota camry': '/images/2020-Toyota-Camry-Super-White.png.avif',
  'hyundai elantra': 'public/images/images.jpeg',
};

const CARS_PER_PAGE = 6;

function formatCar(car) {
  return {
    ...car,
    id: `CAR-${String(car.id).padStart(3, '0')}`,
  };
}

function getNumericId(id) {
  return Number(String(id).replace(/^CAR-/i, ''));
}

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
      loading="lazy"
      onError={() => setFailed(true)}
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
  onUpdateCar,
  onDeleteCar,
}) {
  const [editingCar, setEditingCar] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [view, setView] = useState('cards');

  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const brands = [...new Set(cars.map((car) => car.brand))].sort();

  const sourceCars = searchResult !== null ? searchResult : cars;

  const visibleCars = sourceCars.filter((car) => {
    const searchableText =
      `${car.id} ${car.brand} ${car.model} ${car.plateNumber}`.toLowerCase();

    return (
      searchableText.includes(search.trim().toLowerCase()) &&
      (statusFilter === 'All' || car.status === statusFilter) &&
      (brandFilter === 'All' || car.brand === brandFilter)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(visibleCars.length / CARS_PER_PAGE)
  );

  const paginatedCars = visibleCars.slice(
    (currentPage - 1) * CARS_PER_PAGE,
    currentPage * CARS_PER_PAGE
  );

  async function handleSearchSubmit(event) {
    event.preventDefault();

    const trimmedSearch = search.trim();

    setCurrentPage(1);
    setSearchError('');
    setSearchResult(null);

    // Search by ID through the Spring Boot API.
    if (!/^(CAR-)?\d+$/i.test(trimmedSearch)) {
      return;
    }

    const id = getNumericId(trimmedSearch);

    if (!Number.isInteger(id) || id < 1) {
      setSearchError('Please enter a valid car ID.');
      setSearchResult([]);
      return;
    }

    setSearching(true);

    try {
      const response = await fetch(`/api/v1/cars/${id}`);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Car not found.');
      }

      const data = await response.json();
      setSearchResult([formatCar(data)]);
    } catch (error) {
      setSearchResult([]);
      setSearchError(error.message || 'Unable to search for this car.');
    } finally {
      setSearching(false);
    }
  }

  function handleSearchChange(event) {
    setSearch(event.target.value);
    setSearchResult(null);
    setSearchError('');
    setCurrentPage(1);
  }

  async function handleSave(car) {
    let success;

    if (editingCar) {
      success = await onUpdateCar(car);
    } else {
      success = await onAddCar(car);
    }

    if (success) {
      setEditingCar(null);
      setSearch('');
      setSearchResult(null);
      setSearchError('');
      setCurrentPage(1);
    }

    return success;
  }

  // Delete a car after user confirmation.
  async function handleDelete(car) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${car.brand} ${car.model} (${car.id})?`
    );

    if (!confirmed) {
      return;
    }

    const success = await onDeleteCar(car);

    if (success) {
      setEditingCar(null);
      setSearchResult(null);
      setSearchError('');
      setCurrentPage(1);
    }
  }

  function startEditing(car) {
    setEditingCar(car);

    document.getElementById('fleet-form')?.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    });
  }

  function resetFilters() {
    setSearch('');
    setStatusFilter('All');
    setBrandFilter('All');
    setSearchResult(null);
    setSearchError('');
    setCurrentPage(1);
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
          onClick={() => handleDelete(car)}
        >
          Delete
        </button>
      </div>
    );
  }

  const emptyMessage =
    cars.length === 0
      ? 'No cars yet. Use the form above to add a car.'
      : 'No cars match your filters. Try resetting them.';

  return (
    <section className="fleet-page">
      <div className="fleet-page-heading">
        <div>
          <span className="fleet-eyebrow">YOUR COMPANY FLEET</span>
          <h1>Car Management</h1>
          <p>View, add, and edit company cars.</p>
        </div>

        <span className="fleet-total">
          {cars.length} cars in your fleet
        </span>
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

          <form onSubmit={handleSearchSubmit}>
            <input
              id="fleet-search"
              type="search"
              placeholder="Brand, model, ID or plate"
              value={search}
              onChange={handleSearchChange}
            />

            <button type="submit" disabled={searching}>
              {searching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {searchError && (
            <p role="alert">{searchError}</p>
          )}

          <label htmlFor="fleet-brand">Filter by brand</label>
          <select
            id="fleet-brand"
            value={brandFilter}
            onChange={(event) => {
              setBrandFilter(event.target.value);
              setCurrentPage(1);
            }}
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
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
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

            <div
              className="fleet-view-switch"
              role="group"
              aria-label="View"
            >
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
            paginatedCars.length === 0 ? (
              <p className="fleet-empty">{emptyMessage}</p>
            ) : (
              <div className="fleet-card-grid">
                {paginatedCars.map((car) => (
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
            )
          ) : (
            <div className="fleet-table-wrapper">
              <table style={{ textAlign: 'left' }}>
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
                  {paginatedCars.length === 0 ? (
                    <tr>
                      <td colSpan={8}>{emptyMessage}</td>
                    </tr>
                  ) : (
                    paginatedCars.map((car) => (
                      <tr key={car.id}>
                        <td>{car.id}</td>
                        <td>{car.brand}</td>
                        <td>{car.model}</td>
                        <td>{car.year}</td>
                        <td>{car.plateNumber}</td>
                        <td>{car.color}</td>
                        <td>
                          <StatusBadge status={car.status} />
                        </td>
                        <td>{renderActions(car)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {visibleCars.length > CARS_PER_PAGE && (
            <div className="fleet-pagination">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => page - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>

              <span>
                Page {currentPage} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage((page) => page + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
