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
  accountId: string;
  profileImageURL?: string;
  genderType?: GenderType;
}

export type AuthTokens = {
  accessToken: string;
  csrfToken?: string; // 보류
};
