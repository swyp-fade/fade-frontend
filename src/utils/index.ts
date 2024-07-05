import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function getPayloadFromJWT(jwt: string) {
  return JSON.parse(atob(jwt.split('.')[1]).replaceAll('\\', '')) as {
    id: string;
    accountId: string;
    email: string;
    exp: Date;
    iat: Date;
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
