import { useModalActions } from '@Hooks/modal';
import { useHeader } from '@Hooks/useHeader';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { useState } from 'react';
import { MdInfoOutline, MdOutlineNotificationsNone } from 'react-icons/md';
import { VoteController } from './components/VoteController';
import { VotePolicyBottomSheet } from './components/VotePolicyBottomSheet';

export default function Page() {
  useHeader({
    title: 'FA:P 투표',
    leftSlot: () => <ShowVotePolicyButton />,
    rightSlot: () => <ShowNotificationButton />,
  });

  return (
    <FlexibleLayout.Root className="gap-3">
      <FlexibleLayout.Header>
        <div className="flex flex-row rounded-lg border border-gray-200 bg-white p-3 shadow-bento">
          <p className="flex-1">FADE_1234님은 오늘 10회 투표했어요!</p>
          <span className="text-gray-500">2/10</span>
        </div>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="overflow-visible p-0">
        <VoteController />
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

function ShowVotePolicyButton() {
  const { showModal } = useModalActions();

  const showVotePolicyModal = async () => {
    return await showModal({ type: 'bottomSheet', Component: VotePolicyBottomSheet });
  };

  return (
    <button className="group cursor-pointer rounded-lg p-2 pointerdevice:hover:bg-gray-100" onClick={showVotePolicyModal}>
      <MdInfoOutline className="size-6 group-active:pointerdevice:scale-95" />
    </button>
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
