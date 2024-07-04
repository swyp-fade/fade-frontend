import { useIsAuthenticated, useUser } from '@Hooks/auth';
import { QueryClient } from '@tanstack/react-query';
import LoginView from './views/LoginView';
import { MainView } from './views/MainView';
import { InitializeAccountView } from './views/InitializeAccountView';

export async function loader({ queryClient }: { queryClient: QueryClient }) {
  return '굿...';
}

export default function Page() {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return <InitializePageOrMainPage />;
}

function InitializePageOrMainPage() {
  const user = useUser();

  if (!user) {
    throw new Error('never but for user typeguard in InitializePageOrMainPage');
  }

  const hasAccountId = user.accountId !== '';

  if (!hasAccountId) {
    return <InitializeAccountView />;
  }

  return <MainView />;
}
