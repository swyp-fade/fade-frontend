import { addDays } from 'date-fns';
import { HttpResponse, http } from 'msw';
import { createAccessToken, createRefreshToken } from './utils';
import { HttpStatusCode } from 'axios';
import { ServiceErrorResponse } from '@Types/serviceError';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const userData = {
  id: 'c7b3d8e0-5e0b-4b0f-8b3a-3b9f4b3d3b3d',
  email: 'test_email@fadeapp.site',
  // accountId: '',
  accountId: 'test_accountId',
};

export const handlers = [
  /**
   * MSW는 fetch 정책 상 Header에 Set-Cookie를 지정해주는 대신
   * document.cookie로 지정해주기 때문에, HttpOnly 속성을 넣으면 안 된다(😇)
   */
  http.post(`${BASE_URL}/auth/refresh`, async ({ cookies }) => {
    const { refreshToken } = cookies;

    /**
     * Case 1: Request with no Refresh Token
     * : 서비스를 처음 들어온 경우
     * */
    if (refreshToken === undefined) {
      return new HttpResponse(
        JSON.stringify({
          statusCode: HttpStatusCode.Unauthorized,
          message: '토큰이 존재하지 않습니다.',
          result: {
            errorCode: 'TOKEN_NOT_EXIST',
            data: null,
          },
        } as ServiceErrorResponse),
        { status: HttpStatusCode.Unauthorized }
      );
    }

    /**
     * Case 2: Request with Refresh Token
     * (1) 이전에 로그인 한 적 있고, 다시 재접속을 한 경우
     * (2) Access Token의 만료기간이 임박해서 호출한 경우
     * (3) Access Token의 만료기간이 지나서 호출한 경우
     * */
    return new HttpResponse(
      JSON.stringify({
        accessToken: createAccessToken(userData),
        csrfToken: 'ctct',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `refreshToken=${createRefreshToken(userData)}; Path=/; expires=${addDays(new Date(), 14).toUTCString()}, csrfToken=ctct; Path=/;`,
        },
      }
    );
  }),

  http.get(`${BASE_URL}/auth/signout`, async () => {
    return new HttpResponse(null, {
      headers: {
        'Set-Cookie': `refreshToken=; Path=/; expires=${new Date(0).toUTCString()}, csrfToken=; Path=/; expires=${new Date(0).toUTCString()};`,
      },
    });
  }),

  http.post(`${BASE_URL}/auth/signup`, async ({ request }) => {
    const requestPayload = (await request.json()) as { accountId: string };
    const alreadyExistAccountId = requestPayload.accountId === 'asdf';

    if (alreadyExistAccountId) {
      return HttpResponse.json(
        { errorCode: 'account_already_exists' },
        {
          status: HttpStatusCode.Unauthorized,
        }
      );
    }

    return new HttpResponse(
      JSON.stringify({
        accessToken: createAccessToken(userData),
        csrfToken: 'ctct',
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `refreshToken=${createRefreshToken(userData)}; Path=/; expires=${addDays(new Date(), 14).toUTCString()}, csrfToken=ctct; Path=/;`,
        },
      }
    );
  }),
  http.post(`${BASE_URL}/auth/social-login/KAKAO/signin`, async () => {
    const isSignedUpUser = false;

    if (isSignedUpUser) {
      return new HttpResponse(
        JSON.stringify({
          accessToken: createAccessToken(userData),
          csrfToken: 'ctct',
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `refreshToken=${createRefreshToken(userData)}; Path=/; expires=${addDays(new Date(), 14).toUTCString()}, csrfToken=ctct; Path=/;`,
          },
        }
      );
    }

    return HttpResponse.json(
      {
        statusCode: HttpStatusCode.Unauthorized,
        message: '',
        result: {
          errorCode: 'NOT_MATCH_SOCIAL_MEMBER',
          data: { accessToken: createAccessToken(userData) },
        },
      } as ServiceErrorResponse<'NOT_MATCH_SOCIAL_MEMBER'>,
      {
        status: HttpStatusCode.Unauthorized,
      }
    );
  }),
];
