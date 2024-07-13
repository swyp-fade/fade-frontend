import { useHeader } from '@Hooks/useHeader';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { useState } from 'react';
import { MdBookmark, MdInfoOutline, MdOutlineNotificationsNone } from 'react-icons/md';
import { HowToVoteModal } from './components/HowToVoteModal';
import { VotePolicyBottomSheet } from './components/VotePolicyBottomSheet';

import profileDefaultImage1 from '@Assets/profile_default_1.jpg';
import profileDefaultImage2 from '@Assets/profile_default_2.jpg';
import profileDefaultImage3 from '@Assets/profile_default_3.jpg';
import profileDefaultImage4 from '@Assets/profile_default_4.jpg';

import voteFadeInImage from '@Assets/vote_fade_in.png';
import voteFadeOutImage from '@Assets/vote_fade_out.png';

const defaultProfileImages = [profileDefaultImage1, profileDefaultImage2, profileDefaultImage3, profileDefaultImage4];

type VoteViewStatus = 'beforeVoting' | 'voting' | 'afterVoting';

export default function Page() {
  useHeader({
    title: 'FA:P 투표',
    leftSlot: () => <ShowVotePolicyButton />,
    rightSlot: () => <ShowNotificationButton />,
  });

  const [voteViewState, setVoteViewState] = useState<VoteViewStatus>('beforeVoting');

  const isBeforeVoting = voteViewState === 'beforeVoting';
  const isVoting = voteViewState === 'voting';
  const isAfterVoting = voteViewState === 'afterVoting';

  return (
    <FlexibleLayout.Root className="gap-3">
      <FlexibleLayout.Header>
        <div className="flex flex-row rounded-lg border border-gray-200 bg-white p-3 shadow-bento">
          <p className="flex-1">FADE_1234님은 오늘 10회 투표했어요!</p>
          <span className="text-gray-500">2/10</span>
        </div>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="p-0">ㅇㅇ</FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <BackgroundEllipse />

        {isBeforeVoting && <BeforeVotingFooterButtons onStartClick={() => setVoteViewState('voting')} />}
        {isVoting && <VotingFooterButton />}
        {isAfterVoting && <AfterVotingFooterButton onRetryVote={() => setVoteViewState('voting')} />}
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}

function ShowVotePolicyButton() {
  return (
    <VotePolicyBottomSheet
      triggerSlot={
        <button className="group cursor-pointer rounded-lg p-2 pointerdevice:hover:bg-gray-100">
          <MdInfoOutline className="size-6 group-active:pointerdevice:scale-95" />
        </button>
      }
    />
  );
}

function ShowNotificationButton() {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className="relative" onClick={() => setIsOpened(!isOpened)}>
      <MdOutlineNotificationsNone className="size-6" />

      {isOpened && (
        <div className="absolute right-4 top-full flex min-w-max rounded border bg-white p-5">
          <p>흐으음..</p>
        </div>
      )}
    </div>
  );
}

function BackgroundEllipse() {
  return <div className="absolute bottom-0 left-1/2 -z-10 h-[25rem] w-[170%] -translate-x-1/2 rounded-[100%/100%] bg-purple-50" />;
}

function HowToVoteButton() {
  return (
    <HowToVoteModal
      triggerSlot={
        <button className="group rounded-lg border-gray-200 bg-white p-2 text-xl shadow-bento">
          <span className="inline-block transition-transform pointerdevice:group-hover:scale-105 pointerdevice:group-active:scale-95">투표 방법</span>
        </button>
      }
    />
  );
}

function SubscribeButton() {
  const randomProfileImage = defaultProfileImages.at(Math.floor(Math.random() * 4));

  return (
    <div className="flex flex-row items-center justify-center gap-3 rounded-lg bg-white px-3 py-2 shadow-bento">
      <div style={{ backgroundImage: `url('${randomProfileImage}')` }} className="size-8 rounded-lg" />
      <p className="flex-1">익명의 뭐시기</p>
      <button className="rounded-lg border border-gray-200 px-4 py-1">구독</button>
    </div>
  );
}

function BeforeVotingFooterButtons({ onStartClick }: { onStartClick: () => void }) {
  return (
    <>
      <button className="group rounded-lg bg-purple-700 p-3 text-xl font-semibold text-white shadow-bento" onClick={onStartClick}>
        <span className="inline-block transition-transform pointerdevice:group-hover:scale-105 pointerdevice:group-active:scale-95">투표 시작하기</span>
      </button>

      <HowToVoteButton />
    </>
  );
}

function VotingFooterButton() {
  return (
    <>
      <SubscribeButton />

      <div className="flex flex-row gap-3">
        <button className="group flex-1 rounded-lg bg-white px-5 py-3 shadow-bento transition-colors pointerdevice:hover:bg-gray-200 pointerdevice:active:bg-gray-300">
          <div style={{ backgroundImage: `url('${voteFadeOutImage}')` }} className="mx-auto h-5 w-[8.375rem] transition-transform group-hover:translate-y-[.125rem]" />
        </button>

        <button className="group flex-1 rounded-lg bg-white px-5 py-3 shadow-bento transition-colors pointerdevice:hover:bg-purple-200 pointerdevice:active:bg-purple-300">
          <div style={{ backgroundImage: `url('${voteFadeInImage}')` }} className="mx-auto h-5 w-[6.4375rem] transition-transform group-hover:-translate-y-[.125rem]" />
        </button>

        <button className="rounded-lg bg-white p-3 shadow-bento">
          <MdBookmark className="size-6 text-gray-600" />
        </button>
      </div>
    </>
  );
}

function AfterVotingFooterButton({ onRetryVote }: { onRetryVote: () => void }) {
  return (
    <>
      <button className="group rounded-lg bg-purple-700 p-3 text-xl font-semibold text-white shadow-bento" onClick={onRetryVote}>
        <span className="inline-block transition-transform pointerdevice:group-hover:scale-105 pointerdevice:group-active:scale-95">투표 다시하기</span>
      </button>

      <div className="flex flex-row gap-3">
        <button className="flex-1 rounded-lg bg-white py-2 text-lg shadow-bento">투표 내역 확인</button>
        <button className="flex-1 rounded-lg bg-white py-2 text-lg shadow-bento">북마크 확인</button>
      </div>
    </>
  );
}
