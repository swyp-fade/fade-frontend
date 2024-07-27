import { axios } from '@Libs/axios';

type OutfitField = {
  categoryId: number;
  brandName: string;
  details: string;
};

type CreateFeedPayload = { attachmentId: number; outfits: OutfitField[]; styleIds: number[] };
type CreateFeedResponse = { feedId: number };

export async function requestCreateFeed(payload: CreateFeedPayload) {
  return await axios.post<CreateFeedResponse>(`/feeds`, payload);
}

type BookmarkFeedPayload = { feedId: number; wouldBookmark: boolean };
type BookmarkFeedResponse = null;

export async function requestBookmarkFeed({ feedId, wouldBookmark }: BookmarkFeedPayload) {
  if (wouldBookmark) {
    return await axios.post<BookmarkFeedResponse>(`/bookmark/${feedId}`, {});
  }

  return await axios.delete<BookmarkFeedResponse>(`/bookmark/${feedId}`, {});
}
