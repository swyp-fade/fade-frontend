import RootLayout from '@/layouts/RootLayout';
import { queryClient } from '@Libs/queryclient';
import RootPage, { loader as rootLoader } from '@Pages/Root/page';
import { lazy } from 'react';
import { Route, createRoutesFromElements } from 'react-router-dom';

const NotFoundPage = lazy(() => import('@Pages/NotFoundPage'));

export const routesFromElements = createRoutesFromElements(
  <Route path="/" element={<RootLayout />}>
    <Route index element={<RootPage />} loader={() => rootLoader({ queryClient })} />
    <Route path="*" Component={NotFoundPage} />
  </Route>
);
