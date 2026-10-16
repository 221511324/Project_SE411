import { render, screen, within } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import CarManagement from './CarManagement';

test('displays a car and its details in the table', () => {
  const cars = [
    {
      id: 'CAR-001',
      brand: 'Toyota',
      model: 'Camry',
      year: 2024,
      plateNumber: 'ABC 1234',
      color: 'White',
      status: 'Available',
    },
  ];

  render(
    <CarManagement
      cars={cars}
      onAddCar={vi.fn()}
      onDeleteCar={vi.fn()}
      onUpdateCar={vi.fn()}
    />
  );

  const table = screen.getByRole('table');
  const rows = within(table).getAllByRole('row');

  // One heading row and one car row.
  expect(rows).toHaveLength(2);

  const cells = within(rows[1]).getAllByRole('cell');

  expect(cells.map((cell) => cell.textContent).slice(0, 7)).toEqual([
    'CAR-001',
    'Toyota',
    'Camry',
    '2024',
    'ABC 1234',
    'White',
    'Available',
  ]);

  expect(
    within(rows[1]).getByRole('button', { name: 'Edit' })
  ).toBeInTheDocument();

  expect(
    within(rows[1]).getByRole('button', { name: 'Delete' })
  ).toBeInTheDocument();
});