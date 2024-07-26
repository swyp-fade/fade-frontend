import testImage from '@Assets/test_fashion_image.jpg';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { cn } from '@Utils/index';
import { MdChevronLeft, MdEditNote } from 'react-icons/md';

type ProfileViewType = 'owner' | 'user';
export type AccountProfileViewProps = { viewType: ProfileViewType };

export function AccountProfileView({ viewType, onClose }: DefaultModalProps<void, AccountProfileViewProps>) {
  const isOwnerView = viewType === 'owner';
  const isUserView = viewType === 'user';

  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative flex items-center justify-center py-2">
          <BackButton onClick={() => onClose()} />
          <span className="mx-auto text-h3 font-semibold">
            {isUserView && '계정 상세'}
            {isOwnerView && '내 피드'}
          </span>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        <ProfileDetails viewType={viewType} />
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="group absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100"
      onClick={onClick}>
      <MdChevronLeft className="size-6 transition-transform group-active:scale-95" />
    </button>
  );
}

function ProfileDetails({ viewType }: { viewType: ProfileViewType }) {
  const isOwnerView = viewType === 'owner';
  const isUserView = viewType === 'user';

  return (
    <div>
      <div className="space-y-5 p-5">
        <div className="flex flex-row items-center gap-3">
          <div style={{ backgroundImage: `url('${testImage}')` }} className="size-[4.5rem] rounded-lg bg-cover bg-center bg-no-repeat" />

          <div className="flex flex-1 flex-col justify-center">
            <span className="font-semibold">fade_1234</span>

            <div className="space-x-2">
              <span>구독자</span>
              <span>50</span>
            </div>
          </div>

          {isUserView && <SubscribeToggleButton />}
        </div>

        <div className="flex flex-col">
          <p className="whitespace-pre-line">{`NYC, 28\nobsessed with fashion, photography, and love`}</p>

          {isOwnerView && (
            <button className="group ml-auto cursor-pointer rounded-lg p-1 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100">
              <MdEditNote className="size-6 transition-transform group-active:scale-95" />
            </button>
          )}
        </div>
      </div>

      <div className="grid w-full grid-cols-3 gap-1 p-1">
        {Array.from({ length: 13 })
          .fill(0)
          .map((_, index) => (
            <div key={`item-${index}`} className="group aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-lg">
              <div
                style={{ backgroundImage: `url('${testImage}')` }}
                className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform group-hover:scale-105"
              />
            </div>
          ))}
      </div>
    </div>
  );
}

function SubscribeToggleButton() {
  const isSubscribed = true;

  return (
    <button
      className={cn('h-fit w-[5rem] whitespace-nowrap rounded-lg border border-gray-200 bg-white py-2 transition-colors', {
        ['border-purple-50 bg-purple-50']: isSubscribed,
      })}>
      {isSubscribed && '구독중'}
      {!isSubscribed && '구독'}
    </button>
  );
}
