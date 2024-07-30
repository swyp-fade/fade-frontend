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

import {
  TAllFashionFeedDTO,
  TFAPArchivingFeedDTO,
  TFeedBase,
  TFeedAdittionalDetail,
  TFeedDetailBaseDTO,
  TFeedDTO,
  TMyFeedDTO,
  TOutfitItem,
  TStyleId,
  TVoteCandidateDTO,
  TVoteHistoryFeedDTO,
} from '@Types/model';

function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateUniqueRandomNumbers(count: number, min: number, max: number): number[] {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(generateRandomNumber(min, max));
  }
  return Array.from(numbers);
}

function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
}

function generateRandomUsername(): string {
  return `user_${generateRandomString(8)}`;
}

function generateRandomImage() {
  return testFahsionImages[generateRandomNumber(0, testFahsionImages.length - 1)];
}

function generateBaseFeed(): Omit<TFeedBase, 'id' | 'imageURL'> {
  const styleIdsCount = generateRandomNumber(1, 38);
  const styleIds: TStyleId[] = generateUniqueRandomNumbers(styleIdsCount, 0, 38).map((id) => ({ id }));

  const outfitsCount = generateRandomNumber(1, 5);
  const outfits: TOutfitItem[] = Array.from({ length: outfitsCount }, () => ({
    id: generateRandomNumber(1, 1000),
    brandName: generateRandomString(10),
    details: generateRandomString(20),
    categoryId: generateRandomNumber(0, 7),
  }));

  return {
    memberId: generateRandomNumber(1, 1000),
    styleIds,
    outfits,
    createdAt: new Date(Date.now() - generateRandomNumber(0, 30 * 24 * 60 * 60 * 1000)), // 최근 30일 내의 랜덤한 날짜
  };
}

function generateDummyTVoteCandidateDTO(): TVoteCandidateDTO {
  const baseFeed = generateBaseFeed();
  const { styleIds, ...rest } = baseFeed; // styleIds를 제거합니다.

  return {
    ...rest,
    id: generateRandomNumber(1, 1000),
    imageURL: generateRandomImage(),
    isSubscribed: Math.random() < 0.5,
    isBookmarked: Math.random() < 0.5,
  };
}

function generateDummyTFAPArchivingFeedDTO(): TFAPArchivingFeedDTO {
  const baseFeed = generateBaseFeed();
  const { id, imageURL, ...rest } = baseFeed;

  return {
    ...rest,
    feedId: generateRandomNumber(1, 1000),
    feedImageUrl: generateRandomImage(),
    username: generateRandomUsername(),
    isSubscribed: Math.random() < 0.5,
    isBookmarked: Math.random() < 0.5,
    isMine: Math.random() < 0.1, // 10% 확률로 자신의 피드로 설정
  };
}

function generateDummyTAllFashionFeedDTO(): TAllFashionFeedDTO {
  const baseFeed = generateBaseFeed();

  return {
    ...baseFeed,
    id: generateRandomNumber(1, 1000),
    imageURL: generateRandomImage(),
    username: generateRandomUsername(),
  };
}

function generateBaseFeedDetailDTO(): TFeedDetailBaseDTO {
  const baseFeed = generateBaseFeed();
  return {
    ...baseFeed,
    id: generateRandomNumber(1, 1000),
    imageURL: generateRandomImage(),
    username: generateRandomUsername(),
    profileImageURL: generateRandomImage(),
    isFAPFeed: Math.random() < 0.5,
    isSubscribed: Math.random() < 0.5,
    isBookmarked: Math.random() < 0.5,
    isMine: Math.random() < 0.1, // 10% 확률로 자신의 피드로 설정
    votedAt: Math.random() < 0.5 ? new Date(Date.now() - generateRandomNumber(0, 7 * 24 * 60 * 60 * 1000)) : undefined,
  };
}

function generateDummyTFeedDetailBaseDTO(): TFeedDetailBaseDTO {
  return generateBaseFeedDetailDTO();
}

function generateDummyTMyFeedDTO(): TMyFeedDTO {
  const base = generateBaseFeedDetailDTO();
  const additionalDetail: TFeedAdittionalDetail = {
    fadeInCount: generateRandomNumber(0, 3000),
    bookmarkCount: generateRandomNumber(0, 200),
    reportCount: generateRandomNumber(0, 4),
  };

  return {
    ...base,
    ...additionalDetail,
    isMine: true,
    bookmarkCount: generateRandomNumber(0, 1000),
    reportCount: generateRandomNumber(0, 100),
    isSubscribed: undefined as never, // TypeScript에서 never 타입을 명시적으로 할당
  };
}

function generateDummyTVoteHistoryFeedDTO(): TVoteHistoryFeedDTO {
  const base = generateBaseFeedDetailDTO();
  return {
    ...base,
    votedAt: new Date(Date.now() - generateRandomNumber(0, 7 * 24 * 60 * 60 * 1000)),
  };
}

function generateDummyTFeedDTO(): TFeedDTO {
  const random = Math.random();
  if (random < 0.33) {
    return generateDummyTFeedDetailBaseDTO();
  } else if (random < 0.67) {
    return generateDummyTMyFeedDTO();
  } else {
    return generateDummyTVoteHistoryFeedDTO();
  }
}

export function generateDummyTVoteCandidateDTOs(count: number): TVoteCandidateDTO[] {
  return Array.from({ length: count }, generateDummyTVoteCandidateDTO);
}

export function generateDummyTFAPArchivingFeedDTOs(count: number): TFAPArchivingFeedDTO[] {
  return Array.from({ length: count }, generateDummyTFAPArchivingFeedDTO);
}

export function generateDummyTAllFashionFeedDTOs(count: number): TAllFashionFeedDTO[] {
  return Array.from({ length: count }, generateDummyTAllFashionFeedDTO);
}

export function generateDummyTFeedDTOs(count: number): TFeedDTO[] {
  return Array.from({ length: count }, generateDummyTFeedDTO);
}

export function generateDummyTFeedDetailBaseDTOs(count: number): TFeedDTO[] {
  return Array.from({ length: count }, generateDummyTFeedDTO);
}
