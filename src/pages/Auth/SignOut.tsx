import { useAuthActions } from '@Hooks/auth';
import { requestSignOut } from '@Services/authAPI';
import { Navigate } from 'react-router-dom';

export async function loader() {
  return await requestSignOut();
}

export default function SignOut() {
  const { signOut } = useAuthActions();

  signOut();

  return <Navigate to="/" replace />;
}
