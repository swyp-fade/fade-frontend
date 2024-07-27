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

export interface TFeed {
  id: number;
  memberId: number;
  imageURL: string;
  styleIds: TStyleId[];
  outfits: TOutfitItem[];
  createdAt: Date;
}

export interface TStyleId {
  id: number;
}

export interface TOutfitItem {
  id: number;
  brandName: string;
  details: string;
  categoryId: number;
}

export interface TVoteCandidateAPI extends Omit<TFeed, 'id'> {
  feedId: number;
  isSubscribed: boolean;
  isBookmarked: boolean;
}

export interface TVoteCandidate extends Omit<TFeed, 'id' | 'styleIds'> {
  feedId: number;
  styleIds: number[];
  isSubscribed: boolean;
  isBookmarked: boolean;
}

export interface TVoteCandidateCard extends TVoteCandidate {
  anonName: string;
}

export interface TVoteResult {
  feedId: number;
  voteType: VoteType;
}

export type VoteType = 'FADE_IN' | 'FADE_OUT';

export interface TFAPArchivingFeed extends Omit<TFeed, 'id' | 'styleIds'> {
  feedId: number;
  accountId: string;

  isSubscribed: boolean;
  isBookmarked: boolean;

  outfits: TOutfitItem[];
  styleIds: number[];

  createdAt: Date;
}

export interface TFAPArchivingFeedAPI extends TFeed {
  accountId: string;

  isSubscribed: boolean;
  isBookmarked: boolean;

  outfits: TOutfitItem[];
  styleIds: TStyleId[];

  createdAt: Date;
}

export interface TAllFashionFeedAPI extends TFeed {}
export interface TAllFashionFeed extends Omit<TFeed, 'id' | 'styleIds'> {
  feedId: number;
  styleIds: number[];
}

/**
 * TFeed
 *  TVoteCandidate
 *    TVoteCandidateCard
 *  TFAPArchivingFeed
 */
