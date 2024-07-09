import { ReactNode, useState } from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { AnimatePresence } from 'framer-motion';
import { DialogOverlay } from '../../components/DialogOverlay';
import { AnimatedDialog } from '../../components/AnimatedDialog';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export function UploadGuideBottomSheet({ triggerSlot }: { triggerSlot: ReactNode }) {
  const [isOpened, setIsOpened] = useState(false);

  const handleOpenChange = (wouldOpen: boolean) => {
    setIsOpened(wouldOpen);
  };

  return (
    <AlertDialog.Root open={isOpened} onOpenChange={handleOpenChange}>
      <AlertDialog.Trigger asChild>{triggerSlot}</AlertDialog.Trigger>

      <AnimatePresence>
        {isOpened && (
          <AlertDialog.Portal forceMount container={document.getElementById('rootLayout')!}>
            <DialogOverlay onClick={() => handleOpenChange(false)} />
            <AlertDialog.Title />
            <AlertDialog.Content>
              <VisuallyHidden>
                <AlertDialog.AlertDialogDescription>This description is hidden from sighted users but accessible to screen readers.</AlertDialog.AlertDialogDescription>
              </VisuallyHidden>

              <AnimatedDialog modalType="bottomSheet">
                <FlexibleLayout.Root>
                  <FlexibleLayout.Header>
                    <header className="relative px-5 py-4">
                      <p className="text-center text-2xl font-semibold">사진 업로드 가이드</p>
                    </header>
                  </FlexibleLayout.Header>

                  <FlexibleLayout.Content>
                    <ul className="list-disc space-y-5">
                      <li className="ml-5 whitespace-pre-line">{`FADE는 스타일에만 집중하고자 합니다.\n최대한 얼굴이 보이지 않는 사진으로 올려주세요!\nFADE만의 문화를 함께 만들어가요! :)`}</li>
                      <li className="ml-5 whitespace-pre-line">{`회원님의 스타일이 잘 보이는 사진이 좋습니다.\n얼굴 제외 전신을 볼 수 있는 사진으로 올려주세요!`}</li>
                      <li className="ml-5 whitespace-pre-line">{`FADE는 공정한 FA:P 투표를 위해 노력하고 있습니다.\n공정성을 위해 이미 올린 사진은 다시 올릴 수 없어요!`}</li>
                    </ul>
                  </FlexibleLayout.Content>

                  <FlexibleLayout.Footer>
                    <div className="flex p-4">
                      <button className="flex-1 rounded-lg bg-gray-200 py-2 text-xl text-black transition-colors" onClick={() => handleOpenChange(false)}>
                        확인
                      </button>
                    </div>
                  </FlexibleLayout.Footer>
                </FlexibleLayout.Root>
              </AnimatedDialog>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        )}
      </AnimatePresence>
    </AlertDialog.Root>
  );
}
