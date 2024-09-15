import { axios } from '@Libs/axios';

type CreateBoNPayload = { attachmentId: number; title: string; contents: string };
type CreateBoNResponse = { bonId: number };

export async function requestCreateBoN(payload: CreateBoNPayload) {
  return await axios.post<CreateBoNResponse>(`/bon`, payload);
}
