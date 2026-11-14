
import { useState } from 'react';

const emptyForm = {
  id: '',
  brand: '',
  model: '',
  year: '',
  plateNumber: '',
  color: '',
  status: 'Available',
};

export default function CarForm({
  cars,
  initialCar,
  onSaveCar,
  onCancel,
}) {
  const isEditing = Boolean(initialCar);

  const [form, setForm] = useState(
    initialCar ? { ...initialCar } : { ...emptyForm }
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();

    saveCar();
  }

  async function saveCar() {
    const rawId = isEditing
      ? initialCar.id
      : form.id.trim().toUpperCase();

    const normalizedId = /^CAR-/i.test(rawId)
      ? rawId.toUpperCase()
      : `CAR-${rawId}`;

    const savedCar = {
      id: normalizedId,
      brand: form.brand.trim(),
      model: form.model.trim(),
      year: Number(form.year),
      plateNumber: form.plateNumber.trim().toUpperCase(),
      color: form.color.trim(),
      status: form.status,
    };

    if (
      !isEditing &&
      !/^CAR-\d+$/.test(savedCar.id)
    ) {
      setError('Please enter a valid car ID, for example CAR-003.');
      return;
    }

    if (
      !savedCar.brand ||
      !savedCar.model ||
      !savedCar.plateNumber ||
      !savedCar.color
    ) {
      setError('Please fill in all fields. Spaces alone are not accepted.');
      return;
    }

    if (
      !Number.isInteger(savedCar.year) ||
      savedCar.year < 1886 ||
      savedCar.year > new Date().getFullYear() + 1
    ) {
      setError('Please enter a valid car year.');
      return;
    }

    const duplicateId = cars.some(
      (car) =>
        car.id.trim().toUpperCase() === savedCar.id &&
        (!isEditing || car.id !== initialCar.id)
    );

    if (duplicateId) {
      setError('This car ID already exists. Please use a different ID.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const success = await onSaveCar(savedCar);

      if (success) {
        setError('');

        if (!isEditing) {
          setForm({ ...emptyForm });
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit Car' : 'Add Car'}</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '16px',
        }}
      >
        {[
          ['id', 'ID'],
          ['brand', 'Brand'],
          ['model', 'Model'],
          ['plateNumber', 'Plate Number'],
          ['color', 'Color'],
        ].map(([name, label]) => (
          <label key={name}>
            {label}
            <input
              type="text"
              name={name}
              value={form[name]}
              onChange={handleChange}
              disabled={isEditing && name === 'id'}
              required
              style={{
                display: 'block',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
          </label>
        ))}

        <label>
          Year
          <input
            type="number"
            name="year"
            value={form.year}
            onChange={handleChange}
            min="1886"
            max={new Date().getFullYear() + 1}
            step="1"
            required
            style={{
              display: 'block',
              width: '100%',
              boxSizing: 'border-box',
            }}
          />
        </label>

        <label>
          Status
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{ display: 'block', width: '100%' }}
          >
            <option value="Available">Available</option>
            <option value="In Use">In Use</option>
            <option value="Under Maintenance">
              Under Maintenance
            </option>
          </select>
        </label>
      </div>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={saving}>
        {saving
          ? 'Saving...'
          : isEditing
            ? 'Save Changes'
            : 'Add Car'}
      </button>

      {isEditing && (
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>
      )}
    </form>
  );
}
