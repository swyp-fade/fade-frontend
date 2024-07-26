import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { forwardRef, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { Button } from './ui/button';

type ProfileIntroEditBottomSheetProps = { defaultProfileIntro: string };

export const ProfileIntroEditBottomSheet = forwardRef<HTMLDivElement, DefaultModalProps<void, ProfileIntroEditBottomSheetProps>>(
  ({ defaultProfileIntro, onClose }: DefaultModalProps<void, ProfileIntroEditBottomSheetProps>, ref) => {
    const [profileIntro, setProfileIntro] = useState(defaultProfileIntro);
    const textLength = profileIntro.length;

    return (
      <FlexibleLayout.Root ref={ref} className="h-fit">
        <FlexibleLayout.Header>
          <header className="relative flex flex-row items-center justify-between px-5 pt-4">
            <p className="text-xl font-semibold">프로필 소개 편집</p>
            <Button variants="ghost" size="icon" onClick={() => onClose()}>
              <MdClose className="size-6 text-gray-600" />
            </Button>
          </header>
        </FlexibleLayout.Header>

        <FlexibleLayout.Content className="p-5">
          <div className="flex h-[10.25rem] w-full resize-none flex-col rounded-lg bg-gray-100 p-3">
            <textarea
              className="h-full w-full resize-none bg-transparent align-text-top outline-none transition-colors disabled:bg-gray-300 disabled:text-gray-500"
              placeholder="멋지게 나를 소개해 보아요!"
              value={profileIntro}
              onChange={(e) => setProfileIntro(e.target.value)}
              maxLength={150}
            />
            <p className="text-right text-xs text-gray-400">{textLength > 150 ? 150 : textLength} / 200</p>
          </div>
        </FlexibleLayout.Content>

        <FlexibleLayout.Footer>
          <div className="flex p-4">
            <Button className="w-full text-xl" onClick={() => onClose()}>
              완료
            </Button>
          </div>
        </FlexibleLayout.Footer>
      </FlexibleLayout.Root>
    );
  }
);
