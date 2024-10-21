import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React,{act} from 'react';
import { SWRConfig } from 'swr';
import axios from 'axios';
import App from '../App';
import { mockHeroList } from '../../mock';
import { MemoryRouter } from 'react-router-dom';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('App Component', () => {
  // afterEach(() => {
  //   jest.clearAllMocks();
  //   cleanup(); // Ensure the DOM is cleaned up after each test
  // });

  test('renders loading state initially', () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {})); // Keep promise unresolved

    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <App />
      </SWRConfig>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error message when fetching data fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Failed to fetch mockHeroList'));

    await act(async () => {
      render(
        <MemoryRouter>
          <SWRConfig value={{ dedupingInterval: 0 }}>
            <App />
          </SWRConfig>
        </MemoryRouter>
      );
    });

    await waitFor(() => {
      expect(screen.queryByText((content) => content.startsWith('Error loading data'))).toBeInTheDocument();
    });
  });

  test('renders hero list correctly after data fetch', async () => {
    // Mock successful data fetch
    mockedAxios.get.mockResolvedValueOnce({ data: mockHeroList });

    await act(async () => {
      render(
        <MemoryRouter>
          <SWRConfig value={{ dedupingInterval: 0 }}>
            <App />
          </SWRConfig>
        </MemoryRouter>
      );
    });


    // Wait for data to be rendered and check if heroes are displayed
    await waitFor(() => {
      mockHeroList.results.forEach((hero) => {
        expect(screen.getByText(hero.name)).toBeInTheDocument();
      });
    });
  });

  test('handles pagination correctly', async () => {
    // Mock successful data fetch for the first page
    mockedAxios.get.mockResolvedValueOnce({ data: mockHeroList });

    await act(async () => {
      render(
        <MemoryRouter>
          <SWRConfig value={{ dedupingInterval: 0 }}>
            <App />
          </SWRConfig>
        </MemoryRouter>
      );
    });

    // Wait for the first page to load
    await waitFor(() => expect(screen.getByText(mockHeroList.results[0].name)).toBeInTheDocument());

    // Mock a new page of data when pagination changes
    const mockSecondPageData = {
      count: 20,
      results: [
        { id: '11', name: 'Hero 11' },
        { id: '12', name: 'Hero 12' },
      ],
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockSecondPageData });

    // Simulate page change (assuming a button with text '2' exists)
    const nextPageButton = screen.getByRole('button', { name: '2' });
    fireEvent.click(nextPageButton);

    // Wait for the second page data to load
    await waitFor(() => {
      expect(screen.getByText('Hero 11')).toBeInTheDocument();
      expect(screen.getByText('Hero 12')).toBeInTheDocument();
    });
  });
});
