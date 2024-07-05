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

export type RequiredWith<T, K extends keyof T> = T & {
  [P in K]-?: T[P];
};

export const isAxiosErrorWithCustomCode = (error: unknown): error is RequiredWith<AxiosError<ServiceErrorResponse>, 'response'> => {
  return (
    typeof error === 'object' &&
    error !== null &&
    isAxiosError<ServiceErrorResponse>(error) &&
    !!error.response &&
    !!error.response.data.errorCode &&
    error.response.data.errorCode in SERVICE_ERROR_MESSAGE
  );
};

export function createSuccessLoaderResponse<T>(payload: T): LoaderResponse<T> {
  return { status: LoaderResponseStatus.SUCCESS, payload };
}

export function createErrorLoaderResponse<T = never>(payload: ServiceErrorResponse): LoaderResponse<T> {
  return { status: LoaderResponseStatus.ERROR, payload };
}

export type TryCatcherResult<T> = [T, null] | [null, ServiceErrorCode];

export const tryCatcher = async <T, _>(tryer: () => T | Promise<T>): Promise<TryCatcherResult<T>> => {
  try {
    const result = await tryer();
    return [result, null];
  } catch (error) {
    if (isAxiosErrorWithCustomCode(error)) {
      const { errorCode } = error.response.data;

      return [null, errorCode];
    }

    return [null, 'unknown_error' as ServiceErrorCode];
  }
};

export function clearSearchParams() {
  history.pushState(null, '', window.location.pathname);
}
