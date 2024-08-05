import { TVoteCandidateCard, TVoteResult } from '@Types/model';
import { generateRandomId } from '@Utils/index';
import { format } from 'date-fns';
import { create } from 'zustand';

export type SwipeDirection = 'left' | 'right';
interface VotingState {
  cycleId: string; // 현재 투표 사이클 Id
  viewCards: TVoteCandidateCard[]; // 현재 투표 선택지
  voteResults: TVoteResult[]; // 투표 결과를 담아놓는 곳
  hasVotedToday: boolean; // 오늘 투표를 진행했는지?
  isVotingInProgress: boolean; // 현재 투표 중인지?
  votingCountToday: number; // 오늘 투표한 횟수
  votingProgress: number; // 1부터 시작, 1: 1을 투표할 차례라는 뜻
  swipeDirection: SwipeDirection; // 애니메이션을 위한 스와이프 방향

  generateNewCycleId: () => void;
  setViewCards: (viewCards: TVoteCandidateCard[]) => void;
  updateVoteResult: (voteResult: TVoteResult) => void;
  clearVoteResults: () => void;
  setHasVotedToday: (hasVoted: boolean) => void;
  setIsVotingInProgress: (isInProgress: boolean) => void;
  setVotingCountToday: (votingCountToday: number) => void;
  addVotingCountToday: () => void;
  setVotingProgress: (votingProgress: number) => void;
  addVotingProgress: () => void;
  clearVotingProgress: () => void;
  setSwipeDirection: (swipeDirection: SwipeDirection) => void;

  handleSelect: (swipeDirection: SwipeDirection) => void;
}

export interface TLocalVoteData {
  lastVotedAt: string;
  isVotingInProgress: boolean;
  votingCountToday: number;
  votingProgress: number;
  viewCards: TVoteCandidateCard[];
  hasVotedToday: boolean;
}

const loadSavedVotingData = () => {
  const savedVoteData = localStorage.getItem('FADE_VOTE_DATA');

  if (savedVoteData === null) {
    return {};
  }

  const { lastVotedAt, ...voteData } = JSON.parse(savedVoteData) as TLocalVoteData;

  if (lastVotedAt !== format(new Date(), 'yyyy-MM-dd')) {
    localStorage.removeItem('FADE_VOTE_DATA');
    return {};
  }

  return voteData;
};

export const useVotingStore = create<VotingState>((set, get) => ({
  cycleId: generateRandomId(),
  viewCards: [],
  voteResults: [],
  hasVotedToday: false,
  isVotingInProgress: false,
  votingCountToday: 0,
  votingProgress: 1,
  swipeDirection: 'right',
  ...loadSavedVotingData(),

  generateNewCycleId: () => set({ cycleId: generateRandomId() }),
  setViewCards: (viewCards) => set({ viewCards }),
  updateVoteResult: (voteResult) => set(({ voteResults }) => ({ voteResults: [...voteResults, voteResult] })),
  clearVoteResults: () => set({ voteResults: [] }),
  setHasVotedToday: (hasVotedToday) => set({ hasVotedToday }),
  setIsVotingInProgress: (isVotingInProgress) => set({ isVotingInProgress }),
  setVotingCountToday: (votingCountToday) => set({ votingCountToday }),
  addVotingCountToday: () => set(({ votingCountToday }) => ({ votingCountToday: votingCountToday + 1 })),
  setVotingProgress: (votingProgress) => set({ votingProgress }),
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
