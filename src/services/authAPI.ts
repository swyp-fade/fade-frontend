import { axios } from '@Libs/axios';

export type RequestTokensResponse = {
  accessToken: string;
  csrfToken: string;
};

export async function requestTokens() {
  try {
    const { data: tokens } = await axios.post<RequestTokensResponse | null>('/auth/refresh');

    return tokens;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const enum SignUpType {
  KAKAO = 'kakao',
}

type RequestSignUpPayload = {
  signUpType: SignUpType;
  authorizationCode: string;
};

type RequestSignUpResponse = {
  accessToken: string;
  csrfToken: string;
};

export async function requestSignUp({ signUpType, authorizationCode }: RequestSignUpPayload) {
  try {
    const { data: tokens } = await axios.post<RequestSignUpResponse>(`/oauth/${authorizationCode}`, { signUpType });

    return { ...tokens };
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function requestSignOut() {
  try {
    await axios.get<null>(`/auth/signout`);

    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}
