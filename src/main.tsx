import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import '@xyflow/react/dist/style.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/router.tsx';
import Loading from './components/Loading.tsx';
import React from 'react';

createRoot(document.getElementById('root')!).render(
 <StrictMode>
  <RouterProvider router={router} fallbackElement={<Loading />} />
 </StrictMode>,
);
