import { Header } from '@Components/Header';
import LockUI from '@Components/LockUI';
import { NavBar } from '@Components/NavBar';
import { useVotingStore } from '@Stores/vote';
import { Outlet, useLocation } from 'react-router-dom';
import { FlexibleLayout } from './FlexibleLayout';
import { useHeaderStore } from '@Stores/header';
import { cn } from '@Utils/index';

export default function AppLayoutComponent() {
  const isSubSlotVisible = useHeaderStore((state) => state.isSubSlotVisible);

  return (
    <FlexibleLayout.Root className="w-full flex-1">
      <FlexibleLayout.Header>
        <Header />
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className={cn({ ['-z-10']: isSubSlotVisible })}>
        <ServiceFeatureLockHandler />
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <NavBar />
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}

function ServiceFeatureLockHandler() {
  const location = useLocation();

  const hasVotedToday = useVotingStore((state) => state.hasVotedToday);
  const isCurrentVoteFAPPath = location.pathname === '/vote/fap';
  const shouldShowLockUI = !hasVotedToday && !isCurrentVoteFAPPath;

  return (
    <>
      {shouldShowLockUI && <LockUI />}
      {!shouldShowLockUI && <Outlet />}
    </>
  );
}
