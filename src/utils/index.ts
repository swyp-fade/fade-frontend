import { SERVICE_ERROR_MESSAGE, ServiceErrorCode, ServiceErrorResponse } from '@Types/serviceError';
import { LoaderResponse, LoaderResponseStatus } from '@Types/loaderResponse';
import { AxiosError, isAxiosError } from 'axios';

export function getPayloadFromJWT(jwt: string) {
  return JSON.parse(atob(jwt.split('.')[1]).replaceAll('\\', '')) as {
    id: string;
    accountId: string;
    email: string;
    exp: Date;
    iat: Date;
  };
}
