import { UserDetail } from '@Types/User';
import { getPayloadFromJWT } from '@Utils/index';
import { create } from 'zustand';

export type AuthStore = {
  user: UserDetail;
  accessToken: string | null;
  csrfToken: string | null;
  iat: Date | null;
  exp: Date | null;

  setUser: ({ user }: { user: UserDetail }) => void;
  setAccessToken: ({ accessToken }: { accessToken: string }) => void;
  setCSRFToken: ({ csrfToken }: { csrfToken: string }) => void;
  setTokens: ({ accessToken, csrfToken }: { accessToken: string; csrfToken: string }) => void;
  setAuthFromToken: ({ accessToken }: { accessToken: string }) => void;

  resetAuth: () => void;
};

const initialUserDetail: UserDetail = {
  id: -1,
  accountId: '',
  genderType: undefined,
  profileImageURL: undefined,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: initialUserDetail,
  accessToken: null,
  csrfToken: null,
  iat: null,
  exp: null,
  isAuthentication: false,

  setUser({ user }) {
    set({ user });
  },

  setAccessToken({ accessToken }) {
    set({ accessToken });
  },

  setCSRFToken({ csrfToken }) {
    set({ csrfToken });
  },

  setTokens({ accessToken, csrfToken }) {
    get().setAccessToken({ accessToken });
    get().setCSRFToken({ csrfToken });
  },

  setAuthFromToken({ accessToken }) {
    const { id, username: accountId, genderType, exp, iat } = getPayloadFromJWT(accessToken);

    const newUser: Partial<UserDetail> = { id: +id, accountId, genderType };
    set(({ user }) => ({ user: { ...(user || {}), newUser }, exp, iat }));
  },

  resetAuth() {
    set({ user: initialUserDetail, accessToken: null, csrfToken: null, iat: null, exp: null });
  },
}));
