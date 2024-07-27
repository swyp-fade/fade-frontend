import { axios } from '@Libs/axios';

type UpdateUserDetailsPayload = { accountId: string; profileImageId: number };
type UpdateUserDetailsResponse = '';

/** 유저 정보 변경 요청 */
export async function requestUpdateUserDetails(payload: UpdateUserDetailsPayload) {
  return await axios.put<UpdateUserDetailsResponse>(`/member/me`, payload);
}

type RequestSubscribeMemberPayload = { toMemberId: number; wouldSubscribe: boolean };
type RequestSubscribeMemberResponse = null;

export async function requestSubscribeMember({ toMemberId, wouldSubscribe }: RequestSubscribeMemberPayload) {
  if (wouldSubscribe) {
    return await axios.post<RequestSubscribeMemberResponse>(`/subscribe/${toMemberId}`, {});
  }

  return await axios.delete<RequestSubscribeMemberResponse>(`/subscribe/${toMemberId}`, {});
}
