export type GenderType = 'MALE' | 'FEMALE';

export interface User {
  id: string;
  email: string;
  accountId: string;
  profileImageId: number;
  profileImageURL: string;
  gender?: string;
}

export interface UserDetail {
  id: number;
  email: string;
  accountId: string;
  profileImageId: number;
  profileImageURL: string;
  gender?: GenderType;
}

export type AuthTokens = {
  accessToken: string;
  // csrfToken: string; // 보류
};
