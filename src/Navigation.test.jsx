import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import App from './App';

afterEach(() => {
  vi.restoreAllMocks();
});

async function navigateTo(user, page) {
  const navigation = screen.getByRole('navigation', {
    name: 'Main navigation',
  });

  await user.click(
    within(navigation).getByRole('button', { name: page })
  );
}

function expectDashboardCount(title, count) {
  const heading = screen.getByRole('heading', { name: title });
  const card = heading.closest('article');

  expect(within(card).getByText(String(count))).toBeInTheDocument();
}

test('switches between pages and marks the selected page', async () => {
  const user = userEvent.setup();
  render(<App />);

  expect(
    screen.getByRole('heading', { name: 'Car Management' })
  ).toBeInTheDocument();

  await navigateTo(user, 'Dashboard');

  expect(
    screen.getByRole('heading', { name: 'Dashboard' })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole('heading', { name: 'Car Management' })
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Dashboard' })
  ).toHaveAttribute('aria-current', 'page');

  await navigateTo(user, 'About');

  expect(
    screen.getByRole('heading', { name: 'About' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('heading', { name: 'Our Team' })
  ).toBeInTheDocument();

  await navigateTo(user, 'Car Management');

  expect(screen.getByRole('table')).toBeInTheDocument();
});

test('shows the correct initial dashboard counts', async () => {
  const user = userEvent.setup();
  render(<App />);

  await navigateTo(user, 'Dashboard');

  expectDashboardCount('Total Cars', 2);
  expectDashboardCount('Available Cars', 1);
  expectDashboardCount('Under Maintenance', 1);
});

test('updates dashboard counts after changing a car status', async () => {
  const user = userEvent.setup();
  render(<App />);

  const row = within(screen.getByRole('table'))
    .getByText('CAR-001')
    .closest('tr');

  await user.click(
    within(row).getByRole('button', { name: 'Edit' })
  );
  await user.selectOptions(
    screen.getByRole('combobox', { name: 'Status' }),
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

  const updatedRow = within(screen.getByRole('table'))
    .getByText('CAR-001')
    .closest('tr');

  expect(
    within(updatedRow).getByText('Under Maintenance')
  ).toBeInTheDocument();
});

test('updates dashboard counts after deleting a car', async () => {
  const user = userEvent.setup();
  vi.spyOn(window, 'confirm').mockReturnValue(true);
  render(<App />);

  const row = within(screen.getByRole('table'))
    .getByText('CAR-002')
    .closest('tr');

  await user.click(
    within(row).getByRole('button', { name: 'Delete' })
  );

  await navigateTo(user, 'Dashboard');

  expectDashboardCount('Total Cars', 1);
  expectDashboardCount('Available Cars', 1);
  expectDashboardCount('Under Maintenance', 0);
});