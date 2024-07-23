import { axios } from '@Libs/axios';
import { VoteResultItem } from '@Stores/vote';

/** TODO: 모델로 옮기기 */
export type VoteCandidate = {
  feedId: number;
  userId: number;
  imageURL: string;
};

type GetVoteCandidatesResponse = { voteCandidates: VoteCandidate[] };

export async function requestGetVoteCandidates() {
  return await axios.get<GetVoteCandidatesResponse>('/vote/candidates');
}

type SendVoteResultPayload = VoteResultItem[];

export async function requestSendVoteResult(voteItems: SendVoteResultPayload) {
  return await axios.post('/vote/candidates', { voteItems });
}
