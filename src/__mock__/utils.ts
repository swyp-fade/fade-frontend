import { TOutfitItem, TVoteCandidate, UserDetail } from '@Types/model';
import { addDays, addHours } from 'date-fns';

import testFashionImage1 from '@Assets/test_fashion_image.jpg';
import testFashionImage10 from '@Assets/test_fashion_image_10.jpg';
import testFashionImage2 from '@Assets/test_fashion_image_2.jpg';
import testFashionImage3 from '@Assets/test_fashion_image_3.jpg';
import testFashionImage4 from '@Assets/test_fashion_image_4.jpg';
import testFashionImage5 from '@Assets/test_fashion_image_5.webp';
import testFashionImage6 from '@Assets/test_fashion_image_6.jpg';
import testFashionImage7 from '@Assets/test_fashion_image_7.jpg';
import testFashionImage8 from '@Assets/test_fashion_image_8.jpg';
import testFashionImage9 from '@Assets/test_fashion_image_9.jpg';

const testFahsionImages = [
  testFashionImage1,
  testFashionImage2,
  testFashionImage3,
  testFashionImage4,
  testFashionImage5,
  testFashionImage6,
  testFashionImage7,
  testFashionImage8,
  testFashionImage9,
  testFashionImage10,
];

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

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

function getRandomBrandName(): string {
  const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Uniqlo', 'Gucci', 'Prada'];
  return brands[getRandomNumber(0, brands.length - 1)];
}

function getRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(getRandomNumber(0, chars.length - 1));
  }
  return result;
}

function createRandomOutfitItem(index: number): TOutfitItem {
  return {
    id: index,
    brandName: getRandomBrandName(),
    details: getRandomString(15),
    categoryId: getRandomNumber(0, 6),
  };
}

function createRandomTVoteCandidate(): TVoteCandidate {
  const styleIdsLength = getRandomNumber(1, 6);
  const outfitsLength = getRandomNumber(1, 5);

  const styleIds = Array.from({ length: styleIdsLength }, () => getRandomNumber(0, 10));
  const outfits = Array.from({ length: outfitsLength }, (_, index) => createRandomOutfitItem(index + 1));

  return {
    feedId: getRandomNumber(0, 99),
    memberId: getRandomNumber(1, 1000),
    imageURL: testFahsionImages[getRandomNumber(0, testFahsionImages.length - 1)],
    styleIds,
    outfits,
    isSubscribed: getRandomBoolean(),
    isBookmarked: getRandomBoolean(),
  };
}

export function generateTVoteCandidateDummyData(size: number): TVoteCandidate[] {
  return Array.from({ length: size }, () => createRandomTVoteCandidate());
}
