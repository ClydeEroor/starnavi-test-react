import { render, screen, fireEvent } from '@testing-library/react';

import useSWR from 'swr';
import App from '../App.tsx';

// Мок SWR
jest.mock('swr');

// Мок данных
const mockHeroes = {
  count: 20,
  results: [
    { id: 1, name: 'Hero 1' },
    { id: 2, name: 'Hero 2' },
  ],
};

describe('App component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: null, error: null });

    render(<App />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders error state', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: null, error: true });

    render(<App />);
    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });

  test('renders list of heroes', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: mockHeroes, error: null });

    render(<App />);
    expect(screen.getByText('Hero 1')).toBeInTheDocument();
    expect(screen.getByText('Hero 2')).toBeInTheDocument();
  });

  test('changes page on pagination click', () => {
    (useSWR as jest.Mock).mockReturnValue({ data: mockHeroes, error: null });

    render(<App />);
    const nextPageButton = screen.getByText('Next');
    fireEvent.click(nextPageButton);
  });
});
