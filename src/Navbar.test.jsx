
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from './Navbar';

describe('Navbar', () => {
  it('navigates to the correct pages', () => {
    const setCurrentPage = vi.fn();

    render(
      <Navbar
        currentPage="dashboard"
        setCurrentPage={setCurrentPage}
      />
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Dashboard' })
    );
    expect(setCurrentPage).toHaveBeenLastCalledWith('dashboard');

    fireEvent.click(
      screen.getByRole('button', { name: 'Car Management' })
    );
    expect(setCurrentPage).toHaveBeenLastCalledWith('cars');

    fireEvent.click(
      screen.getByRole('button', { name: 'About' })
    );
    expect(setCurrentPage).toHaveBeenLastCalledWith('about');
  });
});
