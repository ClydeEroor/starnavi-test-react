import React from 'react';
import { render, screen } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Graphs from '../pages/Graphs.tsx';
import { mockHeroData, mockStarShipData } from '../../mock';

// Mocking the axios module
jest.mock('axios');

// Mocking ReactFlow

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Graphs Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test('renders Graphs component correctly', async () => {
    // Mocking successful axios responses
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockHeroData });
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockStarShipData });

    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <BrowserRouter>
          <Graphs />
        </BrowserRouter>
      </SWRConfig>
    );

    // Check that the return link is present
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
    expect(screen.getByText('Mocked ReactFlow')).toBeInTheDocument();
  });

  test('displays error message when hero data fails to load', async () => {
    // Mocking an error for the hero request
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch hero data'));

    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <BrowserRouter>
          <Graphs />
        </BrowserRouter>
      </SWRConfig>
    );

    // Expect to see the error message
    expect(await screen.findByText('Error loading data')).toBeInTheDocument();
  });

  test('displays error message when starship data fails to load', async () => {
    // Mocking successful hero request and an error for starships
    (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockHeroData });
    (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch starship data'));

    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <BrowserRouter>
          <Graphs />
        </BrowserRouter>
      </SWRConfig>
    );

    // Expect to see the error message
    expect(await screen.findByText('Error loading data')).toBeInTheDocument();
  });


  test('renders hero and starship data from mocks and updates nodes and edges', async () => {
    // Мокируем успешные ответы axios
    mockedAxios.get.mockResolvedValueOnce({ data: mockHeroData });
    mockedAxios.get.mockResolvedValueOnce({ data: mockStarShipData });

    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <BrowserRouter>
          <Graphs />
        </BrowserRouter>
      </SWRConfig>
    );

    // Проверяем наличие элемента "Mocked ReactFlow"
    expect(await screen.findByText('Mocked ReactFlow')).toBeInTheDocument();

    // Ждем, пока появится элемент с именем героя
    const heroElement = await screen.findByTestId('hero');
    expect(heroElement).toBeInTheDocument();
    expect(heroElement).toHaveTextContent(/Hero: Obi-Wan Kenobi/i); // Проверяем текст внутри элемента

    // Проверяем, что мокированные данные отображаются
    const starshipElement = await screen.findByTestId('starship');
    expect(starshipElement).toBeInTheDocument();
    expect(starshipElement).toHaveTextContent(/Starship: Jedi starfighter/i); // Проверяем текст внутри элемента
  });


})