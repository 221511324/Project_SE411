import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from './App';

beforeEach(() => {
  // jsdom does not implement scrolling.
  // This mock lets the Edit button run in the test environment.
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

function getCarCard(id) {
  return screen.getByText(id, { exact: true }).closest('article');
}

async function fillNewCar(user, id = 'CAR-003') {
  await user.type(
    screen.getByRole('textbox', { name: 'ID', exact: true }),
    id
  );
  await user.type(
    screen.getByRole('textbox', { name: 'Brand', exact: true }),
    'Kia'
  );
  await user.type(
    screen.getByRole('textbox', { name: 'Model', exact: true }),
    'K5'
  );
  await user.type(
    screen.getByRole('textbox', { name: 'Plate Number', exact: true }),
    'DEF 9012'
  );
  await user.type(
    screen.getByRole('textbox', { name: 'Color', exact: true }),
    'Black'
  );
  await user.type(
    screen.getByRole('spinbutton', { name: 'Year', exact: true }),
    '2025'
  );
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Status', exact: true }),
    'In Use'
  );
}

test('adds a car and clears the form', async () => {
  const user = userEvent.setup();
  render(<App />);

  await fillNewCar(user);
  await user.click(screen.getByRole('button', { name: 'Add Car' }));

  const card = getCarCard('CAR-003');

  expect(
    within(card).getByRole('heading', { name: 'Kia K5' })
  ).toBeInTheDocument();
  expect(within(card).getByText('In Use')).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(3);
  expect(
    screen.getByRole('textbox', { name: 'ID', exact: true })
  ).toHaveValue('');
});

test('rejects duplicate IDs regardless of letter case', async () => {
  const user = userEvent.setup();
  render(<App />);

  await fillNewCar(user, 'car-001');
  await user.click(screen.getByRole('button', { name: 'Add Car' }));

  expect(screen.getByRole('alert')).toHaveTextContent(
    'This car ID already exists'
  );
  expect(screen.getAllByRole('article')).toHaveLength(2);
});

test('edits only the selected car', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(
    within(getCarCard('CAR-001')).getByRole('button', { name: 'Edit' })
  );

  expect(
    screen.getByRole('textbox', { name: 'ID', exact: true })
  ).toBeDisabled();

  const colorInput = screen.getByRole('textbox', {
    name: 'Color',
    exact: true,
  });

  await user.clear(colorInput);
  await user.type(colorInput, 'Blue');
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Status', exact: true }),
    'In Use'
  );
  await user.click(
    screen.getByRole('button', { name: 'Save Changes' })
  );

  expect(
    within(getCarCard('CAR-001')).getByText('Blue')
  ).toBeInTheDocument();
  expect(
    within(getCarCard('CAR-001')).getByText('In Use')
  ).toBeInTheDocument();
  expect(
    within(getCarCard('CAR-002')).getByText('Silver')
  ).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(2);
});

test('cancels editing without changing saved values', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(
    within(getCarCard('CAR-001')).getByRole('button', { name: 'Edit' })
  );

  const colorInput = screen.getByRole('textbox', {
    name: 'Color',
    exact: true,
  });

  await user.clear(colorInput);
  await user.type(colorInput, 'Blue');
  await user.click(screen.getByRole('button', { name: 'Cancel' }));

  expect(
    within(getCarCard('CAR-001')).getByText('White')
  ).toBeInTheDocument();
  expect(
    within(getCarCard('CAR-001')).queryByText('Blue')
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Add Car' })
  ).toBeInTheDocument();
});

test('deletes only the selected car after confirmation', async () => {
  const user = userEvent.setup();
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);
  render(<App />);

  await user.click(
    within(getCarCard('CAR-001')).getByRole('button', { name: 'Delete' })
  );

  expect(confirm).toHaveBeenCalledWith('Delete car CAR-001?');
  expect(screen.queryByText('CAR-001')).not.toBeInTheDocument();
  expect(screen.getByText('CAR-002')).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(1);
});

test('preserves the car when deletion is cancelled', async () => {
  const user = userEvent.setup();
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);
  render(<App />);

  await user.click(
    within(getCarCard('CAR-001')).getByRole('button', { name: 'Delete' })
  );

  expect(confirm).toHaveBeenCalledWith('Delete car CAR-001?');
  expect(screen.getByText('CAR-001')).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(2);
});