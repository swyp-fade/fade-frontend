import { Header } from '@Components/Header';
import { NavBar } from '@Components/NavBar';
import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { FlexibleLayout } from './FlexibleLayout';
import { useVotingStore } from '@Stores/vote';
import LockUI from '@Components/LockUI';

export default function AppLayout() {
  const hasVotedToday = useVotingStore((state) => state.hasVotedToday);
  const location = useLocation();
  const isVoteFAPPath = location.pathname === '/vote-fap';

  return (
    <FlexibleLayout.Root className="w-full flex-1 border border-red-500">
      <FlexibleLayout.Header>
        <Header />
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        <Suspense fallback={<>페이지 로딩 중!</>}>{isVoteFAPPath || hasVotedToday ? <Outlet /> : <LockUI />}</Suspense>
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <NavBar hasVotedToday={hasVotedToday} isVoteFAPPath={isVoteFAPPath} />
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}
