
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import About from './About';

describe('About Page', () => {
  it('displays all team members', () => {
    render(<About />);

    expect(screen.getByText('About the Project')).toBeInTheDocument();
    expect(screen.getByText(/Renad Al Zahrani/)).toBeInTheDocument();
    expect(screen.getByText(/Reema Alnamazi/)).toBeInTheDocument();
    expect(screen.getByText(/Roaa Hamdan/)).toBeInTheDocument();
  });
});
