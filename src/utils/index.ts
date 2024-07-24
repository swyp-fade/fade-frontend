import { LoaderResponse, LoaderResponseStatus } from '@Types/loaderResponse';
import { ServiceErrorResponse } from '@Types/serviceError';
import { isAxiosError } from 'axios';
import { type ClassValue, clsx } from 'clsx';
import { isAfter, isBefore, isSameMonth, isSameYear } from 'date-fns';
import { sha256 } from 'js-sha256';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPayloadFromJWT(jwt: string) {
  return JSON.parse(atob(jwt.split('.')[1]).replaceAll('\\', '')) as {
    id: string;
    accountId: string;
    email: string;
    exp: Date;
    iat: Date;
  };
}

export function createSuccessLoaderResponse<T>(payload: T): LoaderResponse<T> {
  return { status: LoaderResponseStatus.SUCCESS, payload };
}

export function createErrorLoaderResponse<T = never>(payload: ServiceErrorResponse): LoaderResponse<T> {
  return { status: LoaderResponseStatus.ERROR, payload };
}

export type TryCatcherResult<T> = [T, null] | [null, ServiceErrorResponse];

export const tryCatcher = async <T>(tryer: () => T | Promise<T>): Promise<TryCatcherResult<T>> => {
  try {
    const result = await tryer();
    return [result, null];
  } catch (error) {
    if (isAxiosError<ServiceErrorResponse>(error)) {
      /** API 오류 */
      if (error.response) {
        return [null, error.response.data];
      }

      /** 네트워크 오류(disconnected, timeout, cors, etc...) */
      if (error.request) {
        // console.error(error);
        throw error;
      }

      /** 설정 문제이거나 클라이언트 코드 문제임 */
      // console.error(error);
      throw error;
    }

    /** 클라이언트 코드 문제임 */
    // console.error(error);
    throw error;
  }
};

export function clearSearchParams() {
  history.pushState(null, '', window.location.pathname);
}

export function getBase64Image(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.addEventListener('load', () => {
      resolve(<string>fileReader.result);
    });

    fileReader.addEventListener('error', (error) => {
      reject(error);
    });

    fileReader.readAsDataURL(file);
  });
}

// const MAX_FILE_SIZE = 1_000_000; // 16MB
// const MAX_FILE_SIZE = 2 ** 24; // 16MB
const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

type ValidationResult = { isValid: true; message: null } | { isValid: false; message: string };

export const validateLocalImageFile = (imageFile: File): ValidationResult => {
  const isAcceptedTypes = ACCEPTED_IMAGE_TYPES.includes(imageFile.type);

  if (!isAcceptedTypes) {
    return { isValid: false, message: `.jpeg, .jpg, .png, .webp 확장자만 지원합니다.` };
  }

  const isOversize = imageFile.size >= MAX_FILE_SIZE;

  if (isOversize) {
    return { isValid: false, message: '파일이 넘 커요' };
  }

  return { isValid: true, message: null };
};

export const generateRandomId = () => Math.random().toString(32).substring(2);

const randomNames = [
  '알렉산더 맥퀸',
  '알렉산더 왕',
  '캘빈 클라인',
  '도미니코 돌체',
  '도나텔라 베르사체',
  '조르지오 아르마니',
  '후세인 샬라얀',
  '장 폴 고티에',
  '질 샌더',
  '지미 추',
  '존 갈리아노',
  '칼 라거펠트',
  '마크 제이콥스',
  '마이클 코스',
  '미우치아 프라다',
  '폴 스미스',
  '피비 필로',
  '피에르 가르뎅',
  '랄프 로렌',
  '렌조 로소',
  '리카르도 티시',
  '로베르토 카발리',
  '소니아 리키엘',
  '스테파노 가바나',
  '스텔라 맥카트니',
  '톰 브라운',
  '톰 포드',
  '발렌티노 가라바니',
  '비비안 웨스트우드',
  '요지 야마모토',
];

export const generateAnonName = () => `${randomNames[Math.floor(Math.random() * randomNames.length)]}`;

export async function calculateFileHash(file: File) {
  const arrayBuffer = await file.arrayBuffer();

  const hashBuffer = sha256.arrayBuffer(arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

export async function prefetchImages(images: string[]): Promise<void> {
  await Promise.all(
    images.map(
      (image) =>
        new Promise((resolve, reject) => {
          const prefetchImage = new Image();

          prefetchImage.addEventListener('load', () => resolve(null));
          prefetchImage.addEventListener('error', () => reject(null));
          prefetchImage.src = image;
        })
    )
  );
}
export function isBetweenDate(pre: Date, cur: Date, post: Date) {
  return sameOrAfter(cur, pre) && sameOrBefore(cur, post);
}

export function sameOrBefore(d1 = new Date(), d2 = new Date()) {
  return isSameYear(d1, d2) && isSameMonth(d1, d2) ? true : isBefore(d1, d2) ? true : false;
}

export function sameOrAfter(d1 = new Date(), d2 = new Date()) {
  return isSameYear(d1, d2) && isSameMonth(d1, d2) ? true : isAfter(d1, d2) ? true : false;
}
