import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import App from './App';

beforeEach(() => {
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: vi.fn(),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

async function navigateTo(user, page) {
  const navigation = screen.getByRole('navigation', {
    name: 'Main navigation',
  });

  await user.click(
    within(navigation).getByRole('button', { name: page, exact: true })
  );
}

function getCarCard(id) {
  return screen.getByText(id, { exact: true }).closest('article');
}

function expectDashboardCount(title, count) {
  const heading = screen.getByRole('heading', { name: title });
  const card = heading.closest('article');

  expect(within(card).getByText(String(count))).toBeInTheDocument();
}

test('navigates between pages and highlights the selected page', async () => {
  const user = userEvent.setup();
  render(<App />);

  expect(
    screen.getByRole('heading', { name: 'Car Management' })
  ).toBeInTheDocument();

  await navigateTo(user, 'Dashboard');

  expect(
    screen.getByRole('heading', { name: 'Dashboard', exact: true })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'Car Management' })
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Dashboard', exact: true })
  ).toHaveAttribute('aria-current', 'page');

  await navigateTo(user, 'About');

  expect(
    screen.getByRole('heading', { name: 'About the Project' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Our Team' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'About', exact: true })
  ).toHaveAttribute('aria-current', 'page');

  await navigateTo(user, 'Car Management');

  expect(
    screen.getByRole('heading', { name: 'Car Management' })
  ).toBeInTheDocument();
  expect(screen.getAllByRole('article')).toHaveLength(2);
});

test('shows correct initial dashboard counts', async () => {
  const user = userEvent.setup();
  render(<App />);

  await navigateTo(user, 'Dashboard');

  expectDashboardCount('Total Cars', 2);
  expectDashboardCount('Available Cars', 1);
  expectDashboardCount('Under Maintenance', 1);
});

test('updates dashboard counts after editing and preserves the change', async () => {
  const user = userEvent.setup();
  render(<App />);

  await user.click(
    within(getCarCard('CAR-001')).getByRole('button', { name: 'Edit' })
  );

  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Status', exact: true }),
    'Under Maintenance'
  );

  await user.click(
    screen.getByRole('button', { name: 'Save Changes' })
  );

  await navigateTo(user, 'Dashboard');

  expectDashboardCount('Total Cars', 2);
  expectDashboardCount('Available Cars', 0);
  expectDashboardCount('Under Maintenance', 2);

  await navigateTo(user, 'Car Management');

  expect(
    within(getCarCard('CAR-001')).getByText('Under Maintenance')
  ).toBeInTheDocument();
});

test('updates dashboard counts after deleting a car', async () => {
  const user = userEvent.setup();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  render(<App />);

  await user.click(
    within(getCarCard('CAR-002')).getByRole('button', { name: 'Delete' })
  );

  await navigateTo(user, 'Dashboard');

  expectDashboardCount('Total Cars', 1);
  expectDashboardCount('Available Cars', 1);
  expectDashboardCount('Under Maintenance', 0);

  await navigateTo(user, 'Car Management');

  expect(screen.queryByText('CAR-002')).not.toBeInTheDocument();
});

test('updates dashboard counts after adding a car', async () => {
  const user = userEvent.setup();
  render(<App />);

  const fields = [
    ['ID', 'CAR-003'],
    ['Brand', 'Kia'],
    ['Model', 'K5'],
    ['Plate Number', 'DEF 9012'],
    ['Color', 'Black'],
  ];

  for (const [name, value] of fields) {
    await user.type(
      screen.getByRole('textbox', { name, exact: true }),
      value
    );
  }

  await user.type(
    screen.getByRole('spinbutton', { name: 'Year', exact: true }),
    '2025'
  );

  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Status', exact: true }),
    'Available'
  );

  await user.click(screen.getByRole('button', { name: 'Add Car' }));

  await navigateTo(user, 'Dashboard');

  expectDashboardCount('Total Cars', 3);
  expectDashboardCount('Available Cars', 2);
  expectDashboardCount('Under Maintenance', 1);

  await navigateTo(user, 'Car Management');

  expect(
    within(getCarCard('CAR-003')).getByRole('heading', { name: 'Kia K5' })
  ).toBeInTheDocument();
});