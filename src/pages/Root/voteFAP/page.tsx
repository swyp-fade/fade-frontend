import { useHeader } from '@Hooks/useHeader';
import { useState } from 'react';
import { MdInfoOutline, MdOutlineNotificationsNone } from 'react-icons/md';

export default function Page() {
  useHeader({
    title: 'FA:P 투표',
    leftSlot: () => <MdInfoOutline className="size-6" />,
    rightSlot: () => <RightSlotComponent />,
  });

  return (
    <>
      투표 화면
      <ul className="flex flex-col gap-6">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <li key={index} className="aspect-[3/4] w-full rounded-lg bg-gray-100" />
        ))}
      </ul>
    </>
  );
}

/** Popover 테스트용으로 ㅎㅎ */
const RightSlotComponent = () => {
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
};
