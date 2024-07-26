import testImage from '@Assets/test_fashion_image.jpg';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { cn } from '@Utils/index';
import { MdChevronLeft } from 'react-icons/md';

export function SubscribeListView({ onClose }: DefaultModalProps) {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative flex items-center justify-center border-b border-b-gray-200 py-2">
          <BackButton onClick={onClose} />
          <span className="mx-auto text-h3 font-semibold">구독 목록</span>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="bg-gray-100 p-5">
        <ul>
          <li>
            <SubscribeItem />
          </li>
        </ul>
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

function SubscribeItem() {
  return (
    <div className="fle-row flex items-center gap-3 rounded-lg bg-white p-3">
      <div style={{ backgroundImage: `url('${testImage}')` }} className="size-10 rounded-lg bg-contain bg-cover bg-center" />
      <p className="flex-1">fade1234</p>
      <SubscribeToggleButton />
    </div>
  );
}

function SubscribeToggleButton() {
  const isSubscribed = true;

  return (
    <button
      className={cn('w-[5rem] whitespace-nowrap rounded-lg border border-gray-200 bg-white py-2 transition-colors', {
        ['border-purple-50 bg-purple-50']: isSubscribed,
      })}>
      {isSubscribed && '구독중'}
      {!isSubscribed && '구독'}
    </button>
  );
}
