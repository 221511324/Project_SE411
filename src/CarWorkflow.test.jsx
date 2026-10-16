import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App';

afterEach(() => {
  vi.restoreAllMocks();
});

async function fillNewCar(user, id = 'CAR-003') {
  await user.type(screen.getByRole('textbox', { name: 'ID' }), id);
  await user.type(screen.getByRole('textbox', { name: 'Brand' }), 'Kia');
  await user.type(screen.getByRole('textbox', { name: 'Model' }), 'K5');
  await user.type(
    screen.getByRole('textbox', { name: 'Plate Number' }),
    'DEF 9012'
  );
  await user.type(screen.getByRole('textbox', { name: 'Color' }), 'Black');
  await user.type(screen.getByRole('spinbutton', { name: 'Year' }), '2025');
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Status' }),
    'In Use'
  );
}

function getCarRow(id) {
  const table = screen.getByRole('table');
  return within(table).getByText(id).closest('tr');
}

test('adds a car to the table and clears the form', async () => {
  const user = userEvent.setup();
  render(<App />);

  await fillNewCar(user);
  await user.click(screen.getByRole('button', { name: 'Add Car' }));

  const row = getCarRow('CAR-003');

  expect(within(row).getByText('Kia')).toBeInTheDocument();
  expect(within(row).getByText('In Use')).toBeInTheDocument();
  expect(
    within(screen.getByRole('table')).getAllByRole('row')
  ).toHaveLength(4);
  expect(screen.getByRole('textbox', { name: 'ID' })).toHaveValue('');
});

test('rejects a duplicate car ID', async () => {
  const user = userEvent.setup();
  render(<App />);

  await fillNewCar(user, 'car-001');
  await user.click(screen.getByRole('button', { name: 'Add Car' }));

  expect(screen.getByRole('alert')).toHaveTextContent(
    'This car ID already exists'
  );
  expect(
    within(screen.getByRole('table')).getAllByRole('row')
  ).toHaveLength(3);
});

test('edits a car without adding another row', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(
    within(getCarRow('CAR-001')).getByRole('button', { name: 'Edit' })
  );

  expect(screen.getByRole('textbox', { name: 'ID' })).toBeDisabled();

  const colorInput = screen.getByRole('textbox', { name: 'Color' });
  await user.clear(colorInput);
  await user.type(colorInput, 'Blue');
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Status' }),
    'In Use'
  );
  await user.click(screen.getByRole('button', { name: 'Save Changes' }));

  const row = getCarRow('CAR-001');

  expect(within(row).getByText('Blue')).toBeInTheDocument();
  expect(within(row).getByText('In Use')).toBeInTheDocument();
  expect(
    within(getCarRow('CAR-002')).getByText('Silver')
  ).toBeInTheDocument();
  expect(
    within(screen.getByRole('table')).getAllByRole('row')
  ).toHaveLength(3);
});

test('cancels editing without changing the car', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(
    within(getCarRow('CAR-001')).getByRole('button', { name: 'Edit' })
  );

  const colorInput = screen.getByRole('textbox', { name: 'Color' });
  await user.clear(colorInput);
  await user.type(colorInput, 'Blue');
  await user.click(screen.getByRole('button', { name: 'Cancel' }));

  expect(
    within(getCarRow('CAR-001')).getByText('White')
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Add Car' })
  ).toBeInTheDocument();
});

test('deletes only the selected car after confirmation', async () => {
  const user = userEvent.setup();
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
  render(<App />);

  await user.click(
    within(getCarRow('CAR-001')).getByRole('button', { name: 'Delete' })
  );

  expect(confirm).toHaveBeenCalledWith('Delete car CAR-001?');

  const table = screen.getByRole('table');

  expect(within(table).queryByText('CAR-001')).not.toBeInTheDocument();
  expect(within(table).getByText('CAR-002')).toBeInTheDocument();
});

test('keeps the car when deletion is cancelled', async () => {
  const user = userEvent.setup();
  vi.spyOn(window, 'confirm').mockReturnValue(false);
  render(<App />);

  await user.click(
    within(getCarRow('CAR-001')).getByRole('button', { name: 'Delete' })
  );

  expect(
    within(screen.getByRole('table')).getByText('CAR-001')
  ).toBeInTheDocument();
});