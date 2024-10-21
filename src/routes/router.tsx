import { createBrowserRouter } from 'react-router-dom';

import ErrorPage from './error.tsx';
import Layout from '../components/Layout.tsx';
import Graphs from '../pages/Graphs.tsx';
import App from '../App.tsx';
import React from 'react';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: '/graphs',
        element: <Graphs />,
      },
    ],
  },
]);
