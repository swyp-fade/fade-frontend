export type GenderType = 'MALE' | 'FEMALE';

export interface UserDetail {
  id: number;
  accountId: string;
  profileImageURL?: string;
  genderType?: GenderType;
}

export interface AuthTokens {
  accessToken: string;
  csrfToken?: string; // 보류
}
