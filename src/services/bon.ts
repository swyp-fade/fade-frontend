import { axios } from '@Libs/axios';
import { TBoNItem } from '@Types/model';

type GetBoNListBoNPayload = { sort: string; searchType: string; nextCursor: number; size: number };
type GetBoNListBoNResponse = { bonList: TBoNItem[]; nextCursor: number };

export async function requestGetBoNList({ nextCursor, searchType = 'all', size = 10, sort = 'recent' }: GetBoNListBoNPayload) {
  const searchParamsRaw = { searchType, size: size.toString(), sort };
  const searchParams = new URLSearchParams(Object.entries(searchParamsRaw));

  return await axios.get<GetBoNListBoNResponse>(`/bon?${searchParams.toString()}&nextCursor=${nextCursor}`);
}

type CreateBoNPayload = { attachmentId: number; title: string; contents: string };
type CreateBoNResponse = { bonId: number };

export async function requestCreateBoN(payload: CreateBoNPayload) {
  return await axios.post<CreateBoNResponse>(`/bon`, payload);
}
