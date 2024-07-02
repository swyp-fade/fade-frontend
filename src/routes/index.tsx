import RootLayout from '@/layouts/RootLayout';
import { queryClient } from '@Libs/queryclient';
import NotFoundPage from '@Pages/NotFoundPage';
import RootPage, { loader as rootLoader } from '@Pages/Root/page';
import { Route, createRoutesFromElements } from 'react-router-dom';

export const routesFromElements = createRoutesFromElements(
  <Route path="/" element={<RootLayout />}>
    <Route index element={<RootPage />} loader={() => rootLoader({ queryClient })} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>
);
