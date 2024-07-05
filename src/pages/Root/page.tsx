import { LoaderResponseStatus } from '@Types/loaderResponse';
import { useAuthActions, useIsAuthenticated, useUser } from '@Hooks/auth';
import { requestRefreshToken } from '@Services/authAPI';
import { clearSearchParams, createErrorLoaderResponse, createSuccessLoaderResponse, tryCatcher } from '@Utils/index';
import { Link, LoaderFunctionArgs, Navigate, useLoaderData } from 'react-router-dom';

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const shouldNotRefreshToken = searchParams.get('norefreshtoken') !== null;

  if (shouldNotRefreshToken) {
    return createSuccessLoaderResponse(null);
  }

  const [response, errorCode] = await tryCatcher(() => requestRefreshToken());

  /** tryCatcher를 쓰면,, 아래의 구분을 안 해도 될 것 같기도 하고 ;ㅅ; */
  if (response) {
    return createSuccessLoaderResponse(response.data);
  }

  return createErrorLoaderResponse({ errorCode });
}

export default function Page() {
  const isAuthenticated = useIsAuthenticated();

  const { status, payload } = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const { signIn } = useAuthActions();

  if (status === LoaderResponseStatus.ERROR) {
    if (payload.errorCode === 'no_refresh_token') {
      return <Navigate to="/login" />;
    }

    /** 위로 에러 던지기 */
    throw new Error(payload.errorCode);
  }

  const shouldSetAuthToken = !isAuthenticated && status === LoaderResponseStatus.SUCCESS;

  if (shouldSetAuthToken) {
    signIn(payload!);
  }

  clearSearchParams();

  return <Navigate to="/vote-fap" />;
}
