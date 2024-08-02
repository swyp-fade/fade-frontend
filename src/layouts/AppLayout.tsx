import { Header } from '@Components/Header';
import LockUI from '@Components/LockUI';
import { NavBar } from '@Components/NavBar';
import { ToastProvider } from '@Components/ToastProvider';
import { useVotingStore } from '@Stores/vote';
import { Outlet, useLocation } from 'react-router-dom';
import { FlexibleLayout } from './FlexibleLayout';

export default function AppLayout() {
  const location = useLocation();

  const hasVotedToday = useVotingStore((state) => state.hasVotedToday);
  const isVoteFAPPath = location.pathname === '/vote-fap';
  const shouldShowLockUI = !hasVotedToday && !isVoteFAPPath;

  return (
    <FlexibleLayout.Root className="w-full flex-1">
      <FlexibleLayout.Header>
        <Header />
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        {shouldShowLockUI && <LockUI />}
        {!shouldShowLockUI && <Outlet />}

        <ToastProvider />
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <NavBar hasVotedToday={hasVotedToday} isVoteFAPPath={isVoteFAPPath} />
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}
