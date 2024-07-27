import { axios } from '@Libs/axios';
import { TFeed, TVoteCandidate, TVoteResult } from '@Types/model';

type GetVoteCandidatesAPIResponse = { feeds: TFeed[] };
type GetVoteCandidatesResponse = { voteCandidates: TVoteCandidate[] };

export async function requestGetVoteCandidates() {
  return await axios.get<GetVoteCandidatesAPIResponse>('/vote/candidates').then(
    ({ data: { feeds } }) =>
      ({
        voteCandidates: feeds.map(({ id, ...feed }) => ({
          feedId: id,
          ...feed,
        })),
      }) as GetVoteCandidatesResponse
  );
}

type SendVoteResultPayload = TVoteResult[];

export async function requestSendVoteResult(voteItems: SendVoteResultPayload) {
  return await axios.post('/vote/candidates', { voteItems });
}
