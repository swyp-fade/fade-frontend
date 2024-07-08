import { Header } from '@Components/Header';
import { NavBar } from '@Components/NavBar';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { FlexibleLayout } from './FlexibleLayout';

export default function AppLayout() {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <Header />
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        <Suspense fallback={<>페이지 로딩 중!</>}>
          <Outlet />
        </Suspense>
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <NavBar />
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}
