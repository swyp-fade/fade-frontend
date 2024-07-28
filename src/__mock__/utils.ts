import { TAllFashionFeedAPI, TFAPArchivingFeedAPI, TFeedAdittionalDetail, TFeedDetail, TOutfitItem, TStyleId, TVoteCandidateAPI, UserDetail } from '@Types/model';
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
import { InfiniteResponse } from '@Types/response';

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

function createRandomTVoteCandidate(): TVoteCandidateAPI {
  const styleIdsLength = getRandomNumber(1, 6);
  const outfitsLength = getRandomNumber(1, 5);

  const styleIds = Array.from({ length: styleIdsLength }, () => ({ id: getRandomNumber(0, 10) }));
  const outfits = Array.from({ length: outfitsLength }, (_, index) => createRandomOutfitItem(index + 1));

  return {
    feedId: getRandomNumber(0, 99),
    memberId: getRandomNumber(1, 1000),
    imageURL: testFahsionImages[getRandomNumber(0, testFahsionImages.length - 1)],
    styleIds,
    outfits,
    isSubscribed: getRandomBoolean(),
    isBookmarked: getRandomBoolean(),
    createdAt: new Date(),
  };
}

export function generateTVoteCandidateDummyData(size: number): TVoteCandidateAPI[] {
  return Array.from({ length: size }, () => createRandomTVoteCandidate());
}
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomBool = () => Math.random() < 0.5;
const randomString = (length: number) =>
  Array(length)
    .fill(null)
    .map(() => String.fromCharCode(randomInt(97, 122)))
    .join('');

// StyleId 생성 함수
const generateStyleIds = (): TStyleId[] => {
  const count = randomInt(1, 6);
  return Array(count)
    .fill(null)
    .map(() => ({ id: randomInt(0, 10) }));
};

// OutfitItem 생성 함수
const generateOutfitItems = (): TOutfitItem[] => {
  const count = randomInt(1, 5);
  return Array(count)
    .fill(null)
    .map((_, index) => ({
      id: index + 1,
      brandName: randomString(randomInt(3, 7)),
      details: randomString(15),
      categoryId: randomInt(1, 7),
    }));
};

// 단일 TFAPArchivingFeedAPI 아이템 생성 함수
const generateFeedItem = (date: Date): TFAPArchivingFeedAPI => ({
  id: randomInt(1, 100),
  memberId: randomInt(1, 1000),
  imageURL: testFahsionImages[getRandomNumber(0, testFahsionImages.length - 1)],
  styleIds: generateStyleIds(),
  outfits: generateOutfitItems(),
  createdAt: date,
  accountId: `account${randomInt(1, 1000)}`,
  isSubscribed: randomBool(),
  isBookmarked: randomBool(),
});

// 주어진 월에 대한 TFAPArchivingFeedAPI 더미 데이터 생성 함수
export const generateDummyFeedData = (year: number, month: number): TFAPArchivingFeedAPI[] => {
  const result: TFAPArchivingFeedAPI[] = [];
  const today = new Date();
  const lastDayOfMonth = new Date(year, month, 0).getDate();

  // 해당 월의 모든 날짜에 대해 더미 데이터 생성
  for (let day = 1; day <= lastDayOfMonth; day++) {
    const currentDate = new Date(year, month - 1, day);
    if (currentDate < today) {
      result.push(generateFeedItem(currentDate));
    }
  }

  return result;
};

function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateRandomOutfit(): TOutfitItem {
  return {
    id: Math.floor(Math.random() * 1000),
    brandName: ['Nike', 'Adidas', 'Gucci', 'Zara', 'H&M'][Math.floor(Math.random() * 5)],
    details: `Item details ${Math.random().toString(36).substring(7)}`,
    categoryId: Math.floor(Math.random() * 5) + 1,
  };
}

function generateRandomStyleId(): TStyleId {
  return { id: Math.floor(Math.random() * 30) + 1 };
}

function generateRandomFeed(id: number): TAllFashionFeedAPI {
  return {
    id,
    memberId: Math.floor(Math.random() * 1000) + 1,
    username: getRandomString(10),
    imageURL: testFahsionImages[getRandomNumber(0, testFahsionImages.length - 1)],
    styleIds: Array(Math.floor(Math.random() * 5) + 1)
      .fill(null)
      .map(generateRandomStyleId),
    outfits: Array(Math.floor(Math.random() * 5) + 1)
      .fill(null)
      .map(generateRandomOutfit),
    createdAt: generateRandomDate(new Date(2020, 0, 1), new Date()),
  };
}

export function generateDummyFashionFeed(count: number = 10, startCursor: number = 0): InfiniteResponse<{ feeds: TAllFashionFeedAPI[] }> {
  const feeds = Array(count)
    .fill(null)
    .map((_, index) => generateRandomFeed(startCursor + index + 1));

  return {
    feeds,
    nextCursor: startCursor + count,
  };
}

function generateRandomFeedDetail(id: number): TFeedDetail {
  const baseFeed = generateRandomFeed(id);
  const baseDetail: TFeedDetail = {
    ...baseFeed,
    profileImageURL: testFahsionImages[getRandomNumber(0, testFahsionImages.length - 1)],
    feedId: baseFeed.id,
    isFAPFeed: Math.random() < 0.5,
    isSubscribed: Math.random() < 0.5,
    isBookmarked: Math.random() < 0.5,
    isMine: Math.random() < 0.3,
  };

  if (baseDetail.isMine) {
    const mineDetail: TFeedDetail & TFeedAdittionalDetail = {
      ...baseDetail,
      isMine: true,
      isSubscribed: undefined as never,
      fadeInCount: Math.floor(Math.random() * 1000),
      bookmarkCount: Math.floor(Math.random() * 500),
      reportCount: Math.floor(Math.random() * 10),
    };
    return mineDetail;
  } else if (Math.random() < 0.5) {
    const voteDetail: TFeedDetail = {
      ...baseDetail,
      votedAt: generateRandomDate(new Date(2023, 0, 1), new Date()),
    };
    return voteDetail;
  }

  return baseDetail;
}

export function generateDummyFeedDetail(count: number = 10, startCursor: number = 0): InfiniteResponse<{ feeds: TFeedDetail[] }> {
  const feeds = Array(count)
    .fill(null)
    .map((_, index) => generateRandomFeedDetail(startCursor + index + 1));

  return {
    feeds,
    nextCursor: startCursor + count,
  };
}
