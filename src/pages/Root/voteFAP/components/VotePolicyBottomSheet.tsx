import { AnimatedDialog } from '@Components/AnimatedDialog';
import { DialogOverlay } from '@Components/DialogOverlay';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';

type VotePolicyBottomSheetProp = {
  triggerSlot: ReactNode;
};

export function VotePolicyBottomSheet({ triggerSlot }: VotePolicyBottomSheetProp) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <AlertDialog.Root open={isOpened} onOpenChange={setIsOpened}>
      {triggerSlot && <AlertDialog.Trigger asChild>{triggerSlot}</AlertDialog.Trigger>}

      <AnimatePresence>
        {isOpened && (
          <AlertDialog.Portal forceMount container={document.getElementById('portalSection')!}>
            <AlertDialog.Overlay>
              <DialogOverlay onClick={() => setIsOpened(false)} />
            </AlertDialog.Overlay>

            <AlertDialog.Title />

            <AlertDialog.Content>
              <VisuallyHidden>
                <AlertDialog.AlertDialogDescription>This description is hidden from sighted users but accessible to screen readers.</AlertDialog.AlertDialogDescription>
              </VisuallyHidden>

              <AnimatedDialog modalType="bottomSheet">
                <FlexibleLayout.Root>
                  <FlexibleLayout.Header>
                    <header className="relative px-5 py-4">
                      <p className="text-center text-2xl font-semibold">투표 정책</p>
                    </header>
                  </FlexibleLayout.Header>

                  <FlexibleLayout.Content>
                    <ul className="list-disc space-y-3">
                      <li className="ml-5 whitespace-pre-line">{`1사이클은 10회의 FADE IN/OUT 투표로 이루어집니다.`}</li>
                      <li className="ml-5 whitespace-pre-line">{`하루에 가능한 투표 횟수의 제한은 없습니다.`}</li>
                      <li className="ml-5 whitespace-pre-line">{`완료된 투표는 그날의 FA:P 선정에 반영됩니다.`}</li>
                      <li className="ml-5 whitespace-pre-line">{`투표 사진은 FADE의 알고리즘을 통해 무작위 노출됩니다.`}</li>
                      <li className="ml-5 whitespace-pre-line">{`일자별 투표 결과는 FA:P 아카이빙 캘린더에서, 투표 내역은 마이페이지-내 투표 관리에서 확인할 수 있습니다.`}</li>
                    </ul>
                  </FlexibleLayout.Content>

                  <FlexibleLayout.Footer>
                    <div className="flex p-4">
                      <button type="button" className="flex-1 rounded-lg bg-gray-200 py-2 text-xl text-black transition-colors" onClick={() => setIsOpened(false)}>
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
