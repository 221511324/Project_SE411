import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test, vi } from 'vitest';
import CarManagement from './CarManagement';

const sampleCars = [
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
];

function renderPage(cars = sampleCars) {
  render(
    <CarManagement
      cars={cars}
      onAddCar={vi.fn()}
      onUpdateCar={vi.fn()}
      onDeleteCar={vi.fn()}
    />
  );
}

test('displays car cards by default', () => {
  renderPage();

  expect(screen.getByRole('button', { name: 'Cards' }))
    .toHaveAttribute('aria-pressed', 'true');

  expect(screen.getAllByRole('article')).toHaveLength(2);

  expect(
    screen.getByRole('heading', { name: 'Toyota Camry' })
  ).toBeInTheDocument();

  expect(screen.queryByRole('table')).not.toBeInTheDocument();
});

test('switches to a table with the correct car details', async () => {
  const user = userEvent.setup();
  renderPage();

  await user.click(screen.getByRole('button', { name: 'Table' }));

  const rows = within(screen.getByRole('table')).getAllByRole('row');
  expect(rows).toHaveLength(3);

  const cells = within(rows[1]).getAllByRole('cell');

  expect(cells.slice(0, 7).map((cell) => cell.textContent)).toEqual([
    'CAR-001',
    'Toyota',
    'Camry',
    '2024',
    'ABC 1234',
    'White',
    'Available',
  ]);

  await user.click(screen.getByRole('button', { name: 'Cards' }));

  expect(screen.queryByRole('table')).not.toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(2);
});

test('searches by plate number without case sensitivity', async () => {
  const user = userEvent.setup();
  renderPage();

  await user.type(
    screen.getByRole('searchbox', { name: 'Search cars' }),
    'abc 1234'
  );

  expect(screen.getAllByRole('article')).toHaveLength(1);
  expect(
    screen.getByRole('heading', { name: 'Toyota Camry' })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'Hyundai Elantra' })
  ).not.toBeInTheDocument();
});

test('combines filters and resets them', async () => {
  const user = userEvent.setup();
  renderPage();

  await user.type(
    screen.getByRole('searchbox', { name: 'Search cars' }),
    'camry'
  );
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Filter by brand' }),
    'Toyota'
  );
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Filter by status' }),
    'Available'
  );

  expect(screen.getAllByRole('article')).toHaveLength(1);

  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Filter by status' }),
    'Under Maintenance'
  );

  expect(screen.queryAllByRole('article')).toHaveLength(0);
  expect(
    screen.getByText('No cars match your filters. Try resetting them.')
  ).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Reset' }));

  expect(screen.getAllByRole('article')).toHaveLength(2);
  expect(screen.getByRole('searchbox', { name: 'Search cars' }))
    .toHaveValue('');
  expect(screen.getByRole('combobox', { name: 'Filter by brand' }))
    .toHaveValue('All');
  expect(screen.getByRole('combobox', { name: 'Filter by status' }))
    .toHaveValue('All');
});

test('shows a placeholder when a car image fails', () => {
  renderPage();

  fireEvent.error(
    screen.getByRole('img', { name: 'Toyota Camry' })
  );

  expect(screen.getByText('Photo not available')).toBeInTheDocument();
  expect(
    screen.queryByRole('img', { name: 'Toyota Camry' })
  ).not.toBeInTheDocument();
});

test('shows a placeholder for a car without a configured image', () => {
  renderPage([
    {
      ...sampleCars[0],
      id: 'CAR-003',
      brand: 'Kia',
      model: 'K5',
    },
  ]);

  expect(screen.getByText('Photo not available')).toBeInTheDocument();
});

test('shows an empty message when there are no cars', () => {
  renderPage([]);

  expect(
    screen.getByText('No cars yet. Use the form above to add a car.')
  ).toBeInTheDocument();
});