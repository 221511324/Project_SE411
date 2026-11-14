
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from './App';

const initialCars = [
  {
    id: 1,
    brand: 'Toyota',
    model: 'Camry',
    year: 2024,
    plateNumber: 'ABC 1234',
    color: 'White',
    status: 'Available',
  },
  {
    id: 2,
    brand: 'Hyundai',
    model: 'Elantra',
    year: 2023,
    plateNumber: 'XYZ 5678',
    color: 'Silver',
    status: 'Under Maintenance',
  },
];

let mockCars;

function mockResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  };
}

beforeEach(() => {
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });

  mockCars = initialCars.map((car) => ({ ...car }));

  vi.stubGlobal(
    'fetch',
    vi.fn(async (url, options = {}) => {
      const method = options.method || 'GET';
      const id = Number(String(url).split('/').pop());

      if (method === 'POST') {
        const car = JSON.parse(options.body);

        if (mockCars.some((item) => item.id === car.id)) {
          return mockResponse(
            { error: 'This car ID already exists' },
            400
          );
        }

        mockCars.push(car);
        return mockResponse(car, 201);
      }

      if (method === 'PUT') {
        const car = JSON.parse(options.body);
        mockCars = mockCars.map((item) =>
          item.id === id ? car : item
        );
        return mockResponse(car);
      }

      if (method === 'DELETE') {
        mockCars = mockCars.filter((car) => car.id !== id);
        return mockResponse(null, 204);
      }

      return mockResponse(mockCars.map((car) => ({ ...car })));
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function getCarCard(id) {
  const element = await screen.findByText(id, {
    exact: true,
  });

  return element.closest('article');
}

async function waitForCars() {
  await screen.findByText('CAR-001');
  await screen.findByText('CAR-002');
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
    screen.getByRole('textbox', {
      name: 'Plate Number',
      exact: true,
    }),
    'DEF 9012'
  );

  await user.type(
    screen.getByRole('textbox', { name: 'Color', exact: true }),
    'Black'
  );

  await user.type(
    screen.getByRole('spinbutton', {
      name: 'Year',
      exact: true,
    }),
    '2025'
  );

  await user.selectOptions(
    screen.getByRole('combobox', {
      name: 'Status',
      exact: true,
    }),
    'In Use'
  );
}

test('adds a car and clears the form', async () => {
  const user = userEvent.setup();
  render(<App />);

  await waitForCars();

  await fillNewCar(user);

  await user.click(
    screen.getByRole('button', { name: 'Add Car' })
  );

  const card = await getCarCard('CAR-003');

  expect(
    within(card).getByRole('heading', { name: 'Kia K5' })
  ).toBeInTheDocument();

  expect(
    within(card).getByText('In Use')
  ).toBeInTheDocument();

  expect(screen.getAllByRole('article')).toHaveLength(3);

  expect(
    screen.getByRole('textbox', {
      name: 'ID',
      exact: true,
    })
  ).toHaveValue('');
});

test('rejects duplicate IDs regardless of letter case', async () => {
  const user = userEvent.setup();
  render(<App />);

  await waitForCars();

  await fillNewCar(user, 'car-001');

  await user.click(
    screen.getByRole('button', { name: 'Add Car' })
  );

  await waitFor(() => {
    expect(screen.getByRole('alert')).toHaveTextContent(
      'This car ID already exists'
    );
  });

  expect(screen.getAllByRole('article')).toHaveLength(2);
});

test('edits only the selected car', async () => {
  const user = userEvent.setup();
  render(<App />);

  await waitForCars();

  await user.click(
    within(await getCarCard('CAR-001')).getByRole(
      'button',
      { name: 'Edit' }
    )
  );

  expect(
    screen.getByRole('textbox', {
      name: 'ID',
      exact: true,
    })
  ).toBeDisabled();

  const colorInput = screen.getByRole('textbox', {
    name: 'Color',
    exact: true,
  });

  await user.clear(colorInput);
  await user.type(colorInput, 'Blue');

  await user.selectOptions(
    screen.getByRole('combobox', {
      name: 'Status',
      exact: true,
    }),
    'In Use'
  );

  await user.click(
    screen.getByRole('button', { name: 'Save Changes' })
  );

  await waitFor(async () => {
    const card = await getCarCard('CAR-001');

    expect(within(card).getByText('Blue')).toBeInTheDocument();
    expect(within(card).getByText('In Use')).toBeInTheDocument();
  });

  expect(
    within(await getCarCard('CAR-002')).getByText('Silver')
  ).toBeInTheDocument();

  expect(screen.getAllByRole('article')).toHaveLength(2);
});

test('cancels editing without changing saved values', async () => {
  const user = userEvent.setup();
  render(<App />);

  await waitForCars();

  await user.click(
    within(await getCarCard('CAR-001')).getByRole(
      'button',
      { name: 'Edit' }
    )
  );

  const colorInput = screen.getByRole('textbox', {
    name: 'Color',
    exact: true,
  });

  await user.clear(colorInput);
  await user.type(colorInput, 'Blue');

  await user.click(
    screen.getByRole('button', { name: 'Cancel' })
  );

  expect(
    within(await getCarCard('CAR-001')).getByText('White')
  ).toBeInTheDocument();

  expect(
    within(await getCarCard('CAR-001')).queryByText('Blue')
  ).not.toBeInTheDocument();

  expect(
    screen.getByRole('button', { name: 'Add Car' })
  ).toBeInTheDocument();
});

test('deletes only the selected car after confirmation', async () => {
  const user = userEvent.setup();
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(true);

  render(<App />);

  await waitForCars();

  await user.click(
    within(await getCarCard('CAR-001')).getByRole(
      'button',
      { name: 'Delete' }
    )
  );

  expect(confirm).toHaveBeenCalledWith(
  'Are you sure you want to delete Toyota Camry (CAR-001)?'
);

  await waitFor(() => {
    expect(
      screen.queryByText('CAR-001')
    ).not.toBeInTheDocument();
  });

  expect(screen.getByText('CAR-002')).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(1);
});

test('preserves the car when deletion is cancelled', async () => {
  const user = userEvent.setup();
  const confirm = vi.spyOn(window, 'confirm').mockReturnValue(false);

  render(<App />);

  await waitForCars();

  await user.click(
    within(await getCarCard('CAR-001')).getByRole(
      'button',
      { name: 'Delete' }
    )
  );

  expect(confirm).toHaveBeenCalledWith(
  'Are you sure you want to delete Toyota Camry (CAR-001)?'
);

  expect(
    screen.getByText('CAR-001')
  ).toBeInTheDocument();

  expect(screen.getAllByRole('article')).toHaveLength(2);
});
