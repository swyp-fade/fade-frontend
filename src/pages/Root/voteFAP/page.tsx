import { useToastActions } from '@Hooks/toast';
import { useHeader } from '@Hooks/useHeader';
import { useState } from 'react';
import { MdInfoOutline, MdOutlineNotificationsNone } from 'react-icons/md';
import { VotePolicyBottomSheet } from './components/VotePolicyBottomSheet';
import { ReportBottomSheet } from './components/ReportBottomSheet';

export default function Page() {
  useHeader({
    title: 'FA:P 투표',
    leftSlot: () => <ShowVotePolicyButton />,
    rightSlot: () => <RightSlotComponent />,
  });

  const { showToast, closeToast } = useToastActions();

  return (
    <>
      투표 화면
      <button
        className="block"
        onClick={() => {
          const toastId1 = showToast({
            title: '사진 업로드 완료',
            type: 'success',
            actionSlot: () => (
              <button
                onClick={() => {
                  alert('먼갈 보여줌');
                  closeToast(toastId1);
                }}
                className="text-purple-700">
                보러가기
              </button>
            ),
          });
          const toastId2 = showToast({
            title: '사진 업로드 실패',
            type: 'error',
            actionSlot: () => (
              <button
                onClick={() => {
                  alert('먼갈 다시 시도함');
                  closeToast(toastId2);
                }}>
                다시시도
              </button>
            ),
          });
          const toastId3 = showToast({
            title: '신고되었습니다.',
            type: 'basic',
          });
          const toastId4 = showToast({
            title: '어서오세요, FADE_1234님!',
            type: 'welcome',
          });
          const toastId5 = showToast({
            title: '이미 존재하는 ID입니다.',
            type: 'error',
          });
          const toastId6 = showToast({
            title: '업로드할 사진을 추가해주세요!',
            type: 'error',
          });
        }}>
        토스트 테스트
      </button>
      <ReportBottomSheet triggerSlot={<button>신고하기 테스트</button>} />
      <ul className="flex flex-col gap-6">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <li key={index} className="aspect-[3/4] w-full rounded-lg bg-gray-100" />
        ))}
      </ul>
    </>
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
