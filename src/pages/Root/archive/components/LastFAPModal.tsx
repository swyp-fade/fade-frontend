import fapBadgeImage from '@Assets/fap_badge.png';
import fapBgImage from '@Assets/fap_bg.jpg';
import testImage from '@Assets/test_fashion_image.jpg';
import { Image } from '@Components/ui/image';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { forwardRef } from 'react';
import { FaCrown } from 'react-icons/fa6';
import { MdClose } from 'react-icons/md';

export type LastFAPModalProps = {
  feed: {
    id: number;
    imageURL: string;
  };
  user: {
    id: number;
    profileURL: string;
    accountId: string;
  };
};

export const LastFAPModal = forwardRef<HTMLDivElement, DefaultModalProps<void, LastFAPModalProps>>(
  ({ feed, user, onClose }: DefaultModalProps<void, LastFAPModalProps>, ref) => {
    const handleClick = () => {
      /** TODO: 해당 피드 이동 */
      console.log(feed);
      onClose();
    };

    return (
      <FlexibleLayout.Root style={{ backgroundImage: `url('${fapBgImage}')` }} ref={ref} className="h-[32rem] rounded-2xl bg-cover bg-center bg-no-repeat">
        <FlexibleLayout.Header>
          <header className="relative p-5">
            <p className="text-2xl font-semibold">어제의 FA:P</p>
            <CloseButton onClick={onClose} />
          </header>
        </FlexibleLayout.Header>

        <FlexibleLayout.Content className="flex flex-col gap-8 p-5">
          <div className="relative mx-auto aspect-[3/4] h-full w-fit">
            <Image src={testImage} className="rounded-lg border-2 border-purple-500 bg-gray-100 shadow-xl" />
            <Image src={fapBadgeImage} className="absolute right-3 top-3 size-10" />
          </div>

          <div className="mx-auto flex flex-row items-center gap-3">
            <div className="relative">
              <Image src={testImage} className="size-10 rounded-lg bg-gray-100" />
              <FaCrown className="absolute -left-3 -top-4 size-6 -rotate-[25deg] text-yellow-700" />
            </div>

            <span className="text-h6 font-semibold">{user.accountId}</span>
          </div>

          <button className="rounded-lg bg-black py-2 text-h5 font-semibold text-white" onClick={handleClick}>
            보러가기
          </button>
        </FlexibleLayout.Content>
      </FlexibleLayout.Root>
    );
  }
);

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="group absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 transition-colors touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-200"
      onClick={onClick}>
      <MdClose className="size-6 text-gray-500 transition-transform group-active:scale-95" />
    </button>
  );
}
