import { generateRandomId } from '@Utils/index';
import { create } from 'zustand';

export type VoteCandidateCardType = {
  feedId: number;
  userId: number;
  imageURL: string;
  anonName: string;
};

export type SwipeDirection = 'left' | 'right';

export type VoteType = 'FADE_IN' | 'FADE_OUT';

export type VoteResultItem = {
  feedId: number;
  voteType: VoteType;
};

interface VotingState {
  cycleId: string; // 현재 투표 사이클 Id
  viewCards: VoteCandidateCardType[]; // 현재 투표 선택지
  voteResults: VoteResultItem[]; // 투표 결과를 담아놓는 곳
  hasVotedToday: boolean; // 오늘 투표를 진행했는지?
  isVotingInProgress: boolean; // 현재 투표 중인지?
  votingCountToday: number; // 오늘 투표한 횟수
  votingProgress: number; // 1부터 시작, 1: 1을 투표할 차례라는 뜻
  swipeDirection: SwipeDirection; // 애니메이션을 위한 스와이프 방향

  generateNewCycleId: () => void;
  setViewCards: (viewCards: VoteCandidateCardType[]) => void;
  updateVoteResult: (voteResult: VoteResultItem) => void;
  clearVoteResults: () => void;
  setHasVotedToday: (hasVoted: boolean) => void;
  setIsVotingInProgress: (isInProgress: boolean) => void;
  addVotingCountToday: () => void;
  addVotingProgress: () => void;
  clearVotingProgress: () => void;
  setSwipeDirection: (swipeDirection: SwipeDirection) => void;

  handleSelect: (swipeDirection: SwipeDirection) => void;
}

export const useVotingStore = create<VotingState>((set, get) => ({
  cycleId: generateRandomId(),
  viewCards: [],
  voteResults: [],
  hasVotedToday: false,
  isVotingInProgress: false,
  votingCountToday: 0,
  votingProgress: 1,
  swipeDirection: 'right',

  generateNewCycleId: () => set({ cycleId: generateRandomId() }),
  setViewCards: (viewCards) => set({ viewCards }),
  updateVoteResult: (voteResult) => set(({ voteResults }) => ({ voteResults: [...voteResults, voteResult] })),
  clearVoteResults: () => set({ voteResults: [] }),
  setHasVotedToday: (hasVotedToday) => set({ hasVotedToday }),
  setIsVotingInProgress: (isVotingInProgress) => set({ isVotingInProgress }),
  addVotingCountToday: () => set(({ votingCountToday }) => ({ votingCountToday: votingCountToday + 1 })),
  addVotingProgress: () => set(({ votingProgress }) => ({ votingProgress: votingProgress + 1 })),
  clearVotingProgress: () => set({ votingProgress: 1 }),
  setSwipeDirection: (swipeDirection) => set({ swipeDirection }),

  handleSelect: (swipeDirection) => {
    const { viewCards, setViewCards, setSwipeDirection, addVotingCountToday, addVotingProgress, updateVoteResult } = get();
    const currentViewCard = viewCards.at(-1);

    if (currentViewCard) {
      updateVoteResult({ feedId: currentViewCard.feedId, voteType: swipeDirection === 'left' ? 'FADE_OUT' : 'FADE_IN' });
    }

    setViewCards(viewCards.slice(0, -1));
    setSwipeDirection(swipeDirection);

    addVotingProgress();
    addVotingCountToday();
  },
}));
