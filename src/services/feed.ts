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
