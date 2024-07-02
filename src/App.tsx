import { queryClient } from '@Libs/queryclient';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { routesFromElements } from './routes';

const browserRouter = createBrowserRouter(routesFromElements);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={browserRouter} />
    </QueryClientProvider>
  );
}
