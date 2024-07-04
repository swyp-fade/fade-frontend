import { useAuthStore } from '@/stores/auth';
import { useAuthActions } from '@Hooks/auth';
import { SignUpType, requestSignUp } from '@Services/authAPI';
import { useEffect } from 'react';
import { LoaderFunctionArgs, useLoaderData, useNavigate } from 'react-router-dom';

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const authorizationCode = searchParams.get('code');

  if (authorizationCode === null) {
    return null;
  }

  return await requestSignUp({
    signUpType: SignUpType.KAKAO,
    authorizationCode,
  });
}

export default function KakaoCallback() {
  const navigate = useNavigate();

  const tokens = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { signIn } = useAuthActions();

  useEffect(() => {
    /** loader에서 받고 오기 때문에 tokens의 값은 결정되어 있음 */
    const hasTokens = tokens !== null;
    const isValidAccess = hasTokens;

    if (isValidAccess) {
      signIn(tokens);
    }

    return navigate('/', { replace: true });
  }, [tokens]);

  return <>카카오 로그인 중~_~</>;
}
