import { ReportButton } from '@Components/ReportButton';
import { SubscribeButton } from '@Components/SubscribeButton';
import { Image } from '@Components/ui/image';
import { useToastActions } from '@Hooks/toast';
import { requestGetVoteCandidates, requestSendVoteResult } from '@Services/vote';
import { SwipeDirection, useVotingStore } from '@Stores/vote';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TVoteCandidateCard } from '@Types/model';
import { ServiceErrorResponse } from '@Types/serviceError';
import { cn, generateAnonName, prefetchImages } from '@Utils/index';
import { isAxiosError } from 'axios';
import { AnimatePresence, motion, MotionValue, useMotionValue, useTransform, Variants } from 'framer-motion';
import { useEffect, useLayoutEffect, useState, useTransition } from 'react';
import { MdBookmark } from 'react-icons/md';
import { RandomAvatar } from './RandomAvatar';

import swipeFadeInImage from '@Assets/swipe_fade_in.png';
import swipeFadeOutImage from '@Assets/swipe_fade_out.png';
import voteFadeInImage from '@Assets/vote_fade_in.png';
import voteFadeOutImage from '@Assets/vote_fade_out.png';

const viewVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const baseAnimateProps = { initial: 'initial', animate: 'animate', exit: 'exit' };

const cardVariants: Variants = {
  current: { opacity: 1, y: 0, scale: 1, zIndex: 0 },
  upcoming: { opacity: 0.5, y: -64, scale: 0.9, zIndex: -1 },
  remainings: { opacity: 0, y: 0, scale: 0.9, zIndex: -1 },
  exit: (direction: SwipeDirection) => ({ x: direction === 'left' ? '-50%' : '50%', y: 40, rotate: direction === 'left' ? -20 : 20, opacity: 0 }),
};

const letterVariants: Variants = {
  initial: (direction: SwipeDirection) => ({ y: direction === 'left' ? '-100%' : '100%' }),
  animate: { y: 0 },
  exit: (direction: SwipeDirection) => ({ y: direction === 'left' ? '100%' : '-100%' }),
};

const offsetBoundary = 150;

const inputX = [offsetBoundary * -1, 0, offsetBoundary];
const tightInputX = [(offsetBoundary - 100) * -1, 0, offsetBoundary - 100];
const outputX = [-400, 0, 400];
const outputRotate = [-45, 0, 45];
const outputOpacity = [1, 0, 1];

type VotingViewType = 'loading' | 'voting' | 'submitting';

export function VotingView({ onSubmitDone }: { onSubmitDone: () => void }) {
  const { showToast } = useToastActions();

  const isVotingInProgress = useVotingStore((state) => state.isVotingInProgress);

  const setIsVotingInProgress = useVotingStore((state) => state.setIsVotingInProgress);
  const generateNewCycleId = useVotingStore((state) => state.generateNewCycleId);
  const setViewCards = useVotingStore((state) => state.setViewCards);
  const cycleId = useVotingStore((state) => state.cycleId);

  const [viewId, setViewId] = useState<VotingViewType>(isVotingInProgress ? 'voting' : 'loading');

  const isLoadingView = viewId === 'loading';
  const isVotingView = viewId === 'voting';
  const isSubmittingView = viewId === 'submitting';

  const { data: response } = useQuery({
    queryKey: ['vote', 'candidates', cycleId],
    queryFn: () => requestGetVoteCandidates(),
    enabled: viewId === 'loading',
  });

  useEffect(() => {
    if (isVotingInProgress || !response) {
      return;
    }

    /** 투표에 필요한 기본 이미지 Prefetch */
    prefetchImages([swipeFadeInImage, swipeFadeOutImage, voteFadeInImage, voteFadeOutImage]);

    /** viewCards 설정 */
    const { voteCandidates } = response;

    const voteCandidateCards: TVoteCandidateCard[] = voteCandidates.map((voteCandidate) => ({
      ...voteCandidate,
      anonName: generateAnonName(),
    }));

    setViewCards(voteCandidateCards);

    /** 비동기로 투표 후보지 사진 Prefetch */
    const candidateImages = voteCandidates.map(({ imageURL }) => imageURL);

    prefetchImages(candidateImages)
      .catch(() => showToast({ type: 'error', title: '사진을 불러오지 못했어요.' }))
      .finally(() => {
        setViewId('voting');
        setIsVotingInProgress(true);
      });
  }, [response]);

  const handleVoteFinish = () => {
    setViewId('submitting');
    setIsVotingInProgress(false);
  };

  const handleSubmitDone = () => {
    generateNewCycleId();
    onSubmitDone();
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <AnimatePresence mode="wait">
        {isLoadingView && (
          <motion.div key="loading-view" variants={viewVariants} {...baseAnimateProps} className="h-full w-full">
            <LoadingVoteCandidatesView />
          </motion.div>
        )}

        {isVotingView && (
          <motion.div key="awaited-view" variants={viewVariants} {...baseAnimateProps} className="h-full w-full">
            <AwaitedVotingView onVoteFinish={handleVoteFinish} />
          </motion.div>
        )}

        {isSubmittingView && (
          <motion.div key="submitting-view" variants={viewVariants} {...baseAnimateProps} className="h-full w-full">
            <SubmittingView onSubmitDone={handleSubmitDone} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubmittingView({ onSubmitDone }: { onSubmitDone: () => void }) {
  const { showToast } = useToastActions();

  const startTransition = useTransition()[1];
  const clearVoteResults = useVotingStore((state) => state.clearVoteResults);
  const voteResults = useVotingStore((state) => state.voteResults);

  const { mutate: sendVoteResult } = useMutation({
    mutationKey: ['sendVoteResult'],
    mutationFn: requestSendVoteResult,
  });

  useEffect(() => {
    /** Initial Animation 보장을 위한 Transition */
    startTransition(() => {
      sendVoteResult(voteResults, {
        onError(error) {
          /** TODO: showErrorToast 전역으로 빼기 */
          if (isAxiosError<ServiceErrorResponse>(error) && error.response) {
            const { errorCode } = error.response!.data.result;

            /** 비정상적인 서비스 이용으로 인한 오류는 자세히 알려주지 않는 것이 보안적으로 좋긴 해서... */
            if (errorCode === 'DUPLICATE_VOTE_ERROR') {
              showToast({ type: 'error', title: '투표 결과 전송 실패', description: '알 수 없는 오류로 전송에 실패했어요.' });
              return;
            }
          }

          showToast({ type: 'error', title: `알 수 없는 오류(${error.name})`, description: error.message });
        },
        onSettled() {
          clearVoteResults();
          onSubmitDone();
        },
      });
    });
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div>
        {/* TODO: Loading Indicator */}
        <span className="block animate-spin text-center text-[6rem]">😇</span>
        <p className="text-center text-lg">투표 결과를 안전하게 전송 중이에요</p>
      </div>
    </div>
  );
}

function LoadingVoteCandidatesView() {
  const [fakeProgress, setFakeProgress] = useState(10);

  useEffect(() => {
    const randomInterval = 500 + Math.floor(Math.random() * 500);

    const timerId = setInterval(() => {
      const randomProgressValue = Math.floor(Math.random() * 25);
      setFakeProgress((prevValue) => prevValue + randomProgressValue);
    }, randomInterval);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute left-0 top-0 h-1 w-full">
        <motion.div
          key="fake-progress"
          className="h-full bg-purple-500 shadow-bento"
          initial={{ width: 0 }}
          animate={{ width: `${fakeProgress > 90 ? 90 : fakeProgress}%` }}
          exit={{ width: `100%` }}
        />
      </div>

      <div>
        {/* TODO: Loading Indicator */}
        <span className="block animate-spin text-center text-[6rem]">😇</span>
        <p className="text-center text-lg">투표 목록을 불러오는 중입니당</p>
      </div>
    </div>
  );
}

function AwaitedVotingView({ onVoteFinish }: { onVoteFinish: () => void }) {
  const clearVotingProgress = useVotingStore((state) => state.clearVotingProgress);
  const setHasVotedToday = useVotingStore((state) => state.setHasVotedToday);
  const hasVotedToday = useVotingStore((state) => state.hasVotedToday);
  const viewCards = useVotingStore((state) => state.viewCards);

  useLayoutEffect(() => {
    if (viewCards.length === 0) {
      !hasVotedToday && setHasVotedToday(true);

      clearVotingProgress();
      onVoteFinish();
    }
  }, [viewCards]);

  return (
    <div className="flex h-full flex-col justify-between gap-5">
      <VoteCandidateCards />
      <VotingTools />
    </div>
  );
}

function VoteCandidateCards() {
  const viewCards = useVotingStore((state) => state.viewCards);
  const swipeDirection = useVotingStore((state) => state.swipeDirection);

  return (
    <div className="relative flex-1">
      <AnimatePresence custom={swipeDirection}>
        {viewCards.map((card, i) => {
          const isLastCard = i === viewCards.length - 1;
          const isUpcoming = i === viewCards.length - 2;

          return (
            <motion.div
              key={`card-${i}`}
              id={`card-${i}`}
              className={`absolute flex h-full w-full`}
              variants={cardVariants}
              custom={swipeDirection}
              initial="remainings"
              animate={isLastCard ? 'current' : isUpcoming ? 'upcoming' : 'remainings'}
              exit="exit">
              <VoteCandidateCard {...card} isCurrentCard={isLastCard} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

type VoteCandidateCardProps = { isCurrentCard: boolean } & TVoteCandidateCard;

function VoteCandidateCard({ feedId, imageURL, isCurrentCard }: VoteCandidateCardProps) {
  const handleSelect = useVotingStore((state) => state.handleSelect);

  const x = useMotionValue(0);

  const computedX = useTransform(x, inputX, outputX);
  const computedRotate = useTransform(x, inputX, outputRotate);
  const computedOpacity = useTransform(x, tightInputX, outputOpacity);

  const [isReporting, setIsReporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffBoundary, setDragOffBoundary] = useState<SwipeDirection | null>(null);

  const isLeftBoundary = dragOffBoundary === 'left';
  const isRightBoundary = dragOffBoundary === 'right';

  const handleReportEnd = () => {
    setIsReporting(false);
    setIsDragging(false);

    handleSelect('left');
  };

  return (
    <motion.div
      style={{
        x: computedX,
        rotate: computedRotate,
        backgroundImage: `url('${imageURL}')`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
      className="relative flex-1 rounded-lg bg-gray-200 shadow-bento">
      {isCurrentCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn('absolute right-4 top-4 z-[2]', {
            ['z-1']: isDragging || isReporting,
          })}>
          <ReportButton feedId={feedId} onReportEnd={handleReportEnd} />
        </motion.div>
      )}

      <motion.div style={{ opacity: computedOpacity }} className="absolute inset-0 grid place-items-center rounded-lg bg-purple-500">
        {isLeftBoundary && <FadeOutCover />}
        {isRightBoundary && <FadeInCover />}
      </motion.div>

      <DragController
        x={x}
        onDragOffBoundary={(boundary) => setDragOffBoundary(boundary)}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
      />
    </motion.div>
  );
}

function FadeOutCover() {
  return <Image src={swipeFadeOutImage} className="h-[3.2725rem] w-[21.875rem]" />;
}

function FadeInCover() {
  return <Image src={swipeFadeInImage} className="h-[3.2725rem] w-[16.7719rem]" />;
}

type DragControllerProps = {
  x: MotionValue;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOffBoundary: (boundary: SwipeDirection | null) => void;
};

function DragController({ x, onDragStart, onDragEnd, onDragOffBoundary }: DragControllerProps) {
  const handleSelect = useVotingStore((state) => state.handleSelect);

  return (
    <motion.div
      style={{ x }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      drag
      dragSnapToOrigin
      dragElastic={0.06}
      dragConstraints={{ left: 0, right: 0 }}
      dragTransition={{ bounceStiffness: 1000, bounceDamping: 50 }}
      onDragStart={onDragStart}
      onDrag={(_, { offset: { x } }) => {
        const isLeftDirection = x < 0 && x < offsetBoundary * -1;
        const isRightDirection = x > 0 && x > offsetBoundary;
        const hasNoDirection = !isLeftDirection && !isRightDirection;

        isLeftDirection && onDragOffBoundary('left');
        isRightDirection && onDragOffBoundary('right');
        hasNoDirection && onDragOffBoundary(null);
      }}
      onDragEnd={(_, { offset: { x } }) => {
        onDragOffBoundary(null);
        onDragEnd();

        const isOffBoundary = x > offsetBoundary || x < -offsetBoundary;
        const direction = x > 0 ? 'right' : 'left';

        isOffBoundary && handleSelect(direction);
      }}
    />
  );
}

function UserDetailCard() {
  const anonName = useVotingStore(({ viewCards }) => viewCards.at(-1)?.anonName || '');

  return (
    <div className="flex flex-row items-center justify-center gap-3 rounded-lg bg-white px-3 py-2 shadow-bento">
      <RandomAvatar />
      <AnimatedUsername name={anonName} />
      {/* <button className="rounded-lg border border-gray-200 px-4 py-1">구독</button> */}
      <SubscribeButton initialSubscribedStatus={false} userId={0} onToggle={(value) => console.log(value)} />
    </div>
  );
}

function AnimatedUsername({ name }: { name: string }) {
  const swipeDirection = useVotingStore((state) => state.swipeDirection);

  return (
    <div className="relative flex h-full flex-1 items-center">
      <span className="pr-1">익명의</span>
      <div className="relative inline-block flex-1">
        <AnimatePresence custom={swipeDirection} initial={false}>
          <motion.div
            {...baseAnimateProps}
            key={`${name}-${Math.random() * 1024}`}
            className="absolute top-1/2 flex-1 -translate-y-1/2 overflow-hidden"
            transition={{ staggerChildren: 0.007 }}>
            {name.split('').map((letter, index) => {
              return (
                <motion.span
                  key={`${name}-${letter}-${index}`}
                  id={`${name}-${letter}-${index}`}
                  variants={letterVariants}
                  custom={swipeDirection}
                  className={cn('inline-block whitespace-normal', { ['pl-1']: letter === ' ' })}>
                  {letter}
                </motion.span>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function VotingTools() {
  const handleSelect = useVotingStore((state) => state.handleSelect);

  return (
    <div className="flex w-full flex-col gap-3">
      <UserDetailCard />

      <div className="flex flex-row gap-3">
        <VoteButton type="fadeOut" onClick={() => handleSelect('left')} />
        <VoteButton type="fadeIn" onClick={() => handleSelect('right')} />
        <BookmarkButton />
      </div>
    </div>
  );
}

type VoteButtonProps = { type: 'fadeIn' | 'fadeOut'; onClick: () => void };

function VoteButton({ type, onClick }: VoteButtonProps) {
  const isFadeIn = type === 'fadeIn';
  const isFadeOut = type === 'fadeOut';

  return (
    <button
      className={cn('group flex-1 rounded-lg bg-white px-5 py-3 shadow-bento transition-colors', {
        ['touchdevice:active:bg-gray-200 pointerdevice:hover:bg-gray-200 pointerdevice:active:bg-gray-300']: isFadeOut,
        ['touchdevice:active:bg-purple-200 pointerdevice:hover:bg-purple-200 pointerdevice:active:bg-purple-300']: isFadeIn,
      })}
      onClick={onClick}>
      <div
        style={{ backgroundImage: `url('${isFadeIn ? voteFadeInImage : voteFadeOutImage}')` }}
        className={cn('mx-auto h-5 bg-contain bg-center bg-no-repeat transition-transform', {
          ['touchdevice:group-active:translate-y-[.125rem] pointerdevice:group-hover:translate-y-[.125rem]']: isFadeOut,
          ['touchdevice:group-active:-translate-y-[.125rem] pointerdevice:group-hover:-translate-y-[.125rem]']: isFadeIn,
        })}
      />
    </button>
  );
}

function BookmarkButton() {
  return (
    <button className="rounded-lg bg-white p-3 shadow-bento">
      <MdBookmark className="size-6 text-gray-600" />
    </button>
  );
}
