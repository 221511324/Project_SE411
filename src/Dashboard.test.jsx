
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  it('displays the correct car statistics', () => {
    const cars = [
      { id: 'CAR-001', status: 'Available' },
      { id: 'CAR-002', status: 'Under Maintenance' },
      { id: 'CAR-003', status: 'Available' },
    ];

    render(<Dashboard cars={cars} />);

    expect(screen.getByText('Total Cars')).toBeInTheDocument();
    expect(screen.getByText('Available Cars')).toBeInTheDocument();
    expect(screen.getByText('Under Maintenance')).toBeInTheDocument();

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
