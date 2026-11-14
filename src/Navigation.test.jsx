
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

      return mockResponse(mockCars);
    })
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

async function navigateTo(user, page) {
  const navigation = screen.getByRole('navigation', {
    name: 'Main navigation',
  });

  await user.click(
    within(navigation).getByRole('button', {
      name: page,
      exact: true,
    })
  );
}

async function getCarCard(id) {
  const element = await screen.findByText(id, {
    exact: true,
  });

  return element.closest('article');
}

function expectDashboardCount(title, count) {
  const heading = screen.getByRole('heading', {
    name: title,
  });

  const card = heading.closest('article');

  expect(
    within(card).getByText(String(count))
  ).toBeInTheDocument();
}

test('navigates between pages and highlights the selected page', async () => {
  const user = userEvent.setup();
  render(<App />);

  await screen.findByRole('heading', {
  name: 'Car Management',
});

  await screen.findByText('CAR-001');

  await navigateTo(user, 'Dashboard');

  expect(
    screen.getByRole('heading', {
      name: 'Dashboard',
      exact: true,
    })
  ).toBeInTheDocument();

  expect(
    screen.queryByRole('heading', {
      name: 'Car Management',
    })
  ).not.toBeInTheDocument();

  expect(
    screen.getByRole('button', {
      name: 'Dashboard',
      exact: true,
    })
  ).toHaveAttribute('aria-current', 'page');

  await navigateTo(user, 'About');

  expect(
    screen.getByRole('heading', {
      name: 'About the Project',
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: 'Our Team',
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('button', {
      name: 'About',
      exact: true,
    })
  ).toHaveAttribute('aria-current', 'page');

  await navigateTo(user, 'Car Management');

  expect(
    screen.getByRole('heading', {
      name: 'Car Management',
    })
  ).toBeInTheDocument();

  expect(screen.getAllByRole('article')).toHaveLength(2);
});

test('shows correct initial dashboard counts', async () => {
  const user = userEvent.setup();
  render(<App />);

  await screen.findByText('CAR-001');

  await navigateTo(user, 'Dashboard');

  expectDashboardCount('Total Cars', 2);
  expectDashboardCount('Available Cars', 1);
  expectDashboardCount('Under Maintenance', 1);
});

test('updates dashboard counts after editing and preserves the change', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(
    within(await getCarCard('CAR-001')).getByRole(
      'button',
      { name: 'Edit' }
    )
  );

  await user.selectOptions(
    screen.getByRole('combobox', {
      name: 'Status',
      exact: true,
    }),
    'Under Maintenance'
  );

  await user.click(
    screen.getByRole('button', {
      name: 'Save Changes',
    })
  );

  await waitFor(() => {
    expect(screen.queryByText('Loading cars...')).not.toBeInTheDocument();
  });

  await navigateTo(user, 'Dashboard');

  await waitFor(() => {
    expectDashboardCount('Total Cars', 2);
    expectDashboardCount('Available Cars', 0);
    expectDashboardCount('Under Maintenance', 2);
  });

  await navigateTo(user, 'Car Management');

  expect(
    within(await getCarCard('CAR-001')).getByText(
      'Under Maintenance'
    )
  ).toBeInTheDocument();
});

test('updates dashboard counts after deleting a car', async () => {
  const user = userEvent.setup();

  vi.spyOn(window, 'confirm').mockReturnValue(true);

  render(<App />);

  await user.click(
    within(await getCarCard('CAR-002')).getByRole(
      'button',
      { name: 'Delete' }
    )
  );

  await navigateTo(user, 'Dashboard');

  await waitFor(() => {
    expectDashboardCount('Total Cars', 1);
    expectDashboardCount('Available Cars', 1);
    expectDashboardCount('Under Maintenance', 0);
  });

  await navigateTo(user, 'Car Management');

  expect(
    screen.queryByText('CAR-002')
  ).not.toBeInTheDocument();
});

test('updates dashboard counts after adding a car', async () => {
  const user = userEvent.setup();
  render(<App />);

  await screen.findByText('CAR-001');

  const fields = [
    ['ID', 'CAR-003'],
    ['Brand', 'Kia'],
    ['Model', 'K5'],
    ['Plate Number', 'DEF 9012'],
    ['Color', 'Black'],
  ];

  for (const [name, value] of fields) {
    await user.type(
      screen.getByRole('textbox', {
        name,
        exact: true,
      }),
      value
    );
  }

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
    'Available'
  );

  await user.click(
    screen.getByRole('button', {
      name: 'Add Car',
    })
  );

  await navigateTo(user, 'Dashboard');

  await waitFor(() => {
    expectDashboardCount('Total Cars', 3);
    expectDashboardCount('Available Cars', 2);
    expectDashboardCount('Under Maintenance', 1);
  });

  await navigateTo(user, 'Car Management');

  expect(
    within(await getCarCard('CAR-003')).getByRole(
      'heading',
      { name: 'Kia K5' }
    )
  ).toBeInTheDocument();
});
