import { UserDetail } from '@Types/model';
import { addDays, addHours } from 'date-fns';

function encodeJWT(payload: UserDetail, secret: string, exp: Date) {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const encodedHeader = btoa(JSON.stringify(header)).replace(/=+$/, '');
  const encodedPayload = btoa(JSON.stringify({ ...payload, iat: new Date().toUTCString(), exp })).replace(/=+$/, '');

  const signature = btoa(secret).replace(/=+$/, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const createJWT = (userData: UserDetail, expiresIn: Date) => encodeJWT(userData, 'JWT_SECRET', expiresIn);

export const createAccessToken = (userData: UserDetail) => createJWT(userData, addHours(new Date(), 1));
export const createRefreshToken = (userData: UserDetail) => createJWT(userData, addDays(new Date(), 14));
