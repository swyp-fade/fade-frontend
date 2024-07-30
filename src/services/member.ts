import { axios } from '@Libs/axios';
import { TFeedUserDetail, TMyUserDetail, TSubscriber, TSubscriberDTO } from '@Types/model';
import { InfiniteResponse } from '@Types/response';

type UpdateUserDetailsPayload = Pick<TMyUserDetail, 'username' | 'profileImageURL'>;
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

type RequestGetSubscribersPayload = { nextCursor: number };
type RequestGetSubscribersResponseAPI = InfiniteResponse<{ subscribers: TSubscriberDTO[]; totalSubscribers: number }>;
type RequestGetSubscribersResponse = InfiniteResponse<{ subscribers: TSubscriber[]; totalSubscribers: number }>;

export async function requestGetSubscribers({ nextCursor }: RequestGetSubscribersPayload) {
  return await axios.get<RequestGetSubscribersResponseAPI>(`/subscribe/subscribers?nextCursor=${nextCursor}`).then(
    ({ data: { subscribers, nextCursor, totalSubscribers } }) =>
      ({
        subscribers: subscribers.map(
          ({ id, ...rest }) =>
            ({
              ...rest,
              userId: id,
            }) as TSubscriber
        ),
        nextCursor,
        totalSubscribers,
      }) as RequestGetSubscribersResponse
  );
}

type RequestGetFeedUserDetailsPayload = { userId: number };
// type RequestGetFeedUserDetailsResponseAPI = { details: TFeedUserDetail };
type RequestGetFeedUserDetailsResponse = { details: TFeedUserDetail };

export async function requestGetFeedUserDetails({ userId }: RequestGetFeedUserDetailsPayload) {
  return await axios.get<RequestGetFeedUserDetailsResponse>(`/member/${userId}`);
}
