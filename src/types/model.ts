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
  styleIds: number[];
  outfits: TOutfitItem[];
}

export interface TOutfitItem {
  id: number;
  brandName: string;
  details: string;
  categoryId: number;
}

export interface TVoteCandidate extends Omit<TFeed, 'id'> {
  feedId: number;
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

/**
 * TFeed
 *  TVoteCandidate
 *    TVoteCandidateCard
 */
