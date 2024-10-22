import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React, { act } from 'react';
import axios from 'axios';
import App from '../App';
import { mockHeroList } from '../../mock';
import { MemoryRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('App Component', () => {
  test('renders loading state initially', async () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {})); // Оставить обещание нерешенным, имитируя длительную загрузку
    await act(async () => {
      render(
        <MemoryRouter>
          <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
            <App />
          </SWRConfig>
        </MemoryRouter>
      );
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error message when fetching data fails', async () => {
    const mockError = new Error('Failed to fetch mockHeroList');
    mockedAxios.get.mockRejectedValueOnce(mockError);

    await act(async () => {
      render(
        <MemoryRouter>
          <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
            <App />
          </SWRConfig>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.getByText('Error loading data')).toBeInTheDocument();
    });
  });

  test('renders hero list correctly after data fetch', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockHeroList });

    await act(async () => {
      render(
        <MemoryRouter>
          <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
            <App />
          </SWRConfig>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      mockHeroList.results.forEach((hero) => {
        expect(screen.getByText(hero.name)).toBeInTheDocument();
      });
    });
  });

  test('handles pagination correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockHeroList });

    await act(async () => {
      render(
        <MemoryRouter>
          <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
            <App />
          </SWRConfig>
        </MemoryRouter>
      );
    });

    await waitFor(() =>
      expect(screen.getByText(mockHeroList.results[0].name)).toBeInTheDocument()
    );

    const mockSecondPageData = {
      count: 20,
      results: [
        { id: '11', name: 'Hero 11' },
        { id: '12', name: 'Hero 12' },
      ],
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockSecondPageData });

    const nextPageButton = screen.getByRole('button', { name: '2' });
    fireEvent.click(nextPageButton);

    await waitFor(() => {
      expect(screen.getByText('Hero 11')).toBeInTheDocument();
      expect(screen.getByText('Hero 12')).toBeInTheDocument();
    });
  });
});
