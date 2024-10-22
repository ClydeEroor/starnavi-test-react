import React from 'react';
import useSWR from 'swr';
import HeroList from './components/HeroList.tsx';
import HeroItem from './components/HeroItem.tsx';
import Pagination from './components/Pagination.tsx';
import { FC, useState } from 'react';
import { fetcher } from '../utils/fetchers.ts';
import { API_URL } from '../constants';
import { HeroListProp } from '../types';

const App: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: heroes, error } = useSWR<HeroListProp>(
    `${API_URL}/people?page=${currentPage}&limit=${ITEMS_PER_PAGE}`,
    fetcher
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) return <div>Error loading data</div>;
  if (!heroes) return <div>Loading...</div>;

  const totalPages = Math.ceil(heroes.count / ITEMS_PER_PAGE);
  return (
    <>
      <HeroList>
        {heroes.results.map((hero, idx: number) => (
          <HeroItem id={hero.id} name={hero.name} key={`hero-item-${idx}`} />
        ))}
      </HeroList>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </>
  );
};

export default App;
