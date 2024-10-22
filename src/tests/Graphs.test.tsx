import { render, screen, waitFor, act, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { mockHeroData, mockStarShipData } from '../../mock';
import Graphs from '../pages/Graphs.tsx';
import axios from 'axios';
import React from 'react';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Graphs Component', () => {
 beforeEach(() => {
  jest.clearAllMocks();
  cleanup();
 });

 test('renders loading state initially', async () => {
  mockedAxios.get.mockReturnValue(new Promise(() => {}));

  await act(async () => {
   render(
    <MemoryRouter initialEntries={['/?heroId=1']}>
     <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
      <Graphs />
     </SWRConfig>
    </MemoryRouter>,
   );
  });

  expect(screen.getByText('Loading...')).toBeInTheDocument();
 });

 test('displays error message when fetching HERO data fails', async () => {
  mockedAxios.get.mockReturnValueOnce(
   Promise.reject(new Error('Failed to load hero data')),
  );

  await act(async () => {
   render(
    <MemoryRouter initialEntries={['/?heroId=1']}>
     <SWRConfig value={{ dedupingInterval: 0, provider: () => new Map() }}>
      <Graphs />
     </SWRConfig>
    </MemoryRouter>,
   );
  });

  await waitFor(() => {
   expect(screen.getByText('Error loading hero data')).toBeInTheDocument();
  });
 });

 test('displays error message when fetching STARSHIP data fails', async () => {
  mockedAxios.get.mockResolvedValueOnce({
   data: { name: mockHeroData.name, films: mockHeroData.films },
  });

  mockedAxios.get.mockRejectedValueOnce(
   new Error('Failed to load starship data'),
  );

  await act(async () => {
   render(
    <MemoryRouter initialEntries={['/?heroId=1']}>
     <SWRConfig value={{ dedupingInterval: 0 }}>
      <Graphs />
     </SWRConfig>
    </MemoryRouter>,
   );
  });

  await waitFor(() => {
   expect(screen.getByText('Error loading starship data')).toBeInTheDocument();
  });
 });

 test('renders hero and starship nodes correctly after data fetch', async () => {
  mockedAxios.get.mockImplementation((url) => {
   if (url.includes('/people/1')) {
    return Promise.resolve({ data: mockHeroData });
   }
   if (url.includes('/starships')) {
    return Promise.resolve({ data: mockStarShipData });
   }
   return Promise.reject(new Error('not found'));
  });

  await act(async () => {
   render(
    <MemoryRouter initialEntries={['/?heroId=1']}>
     <SWRConfig value={{ dedupingInterval: 0 }}>
      <Graphs />
     </SWRConfig>
    </MemoryRouter>,
   );
  });

  await waitFor(() => {
   expect(screen.getByText(`Hero: ${mockHeroData.name}`)).toBeInTheDocument();

   mockHeroData.films.forEach((film) => {
    expect(screen.getByText(`Film ${film}`)).toBeInTheDocument();
   });

   mockStarShipData.results.forEach((starship) => {
    expect(screen.getByText(`Starship: ${starship.name}`)).toBeInTheDocument();
   });
  });
 });
});
