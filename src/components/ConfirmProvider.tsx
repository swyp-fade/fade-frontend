import { AnimatedDialog } from '@Components/AnimatedDialog';
import { DialogOverlay } from '@Components/DialogOverlay';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useConfirmStore } from '@Stores/confirm';
import { AnimatePresence } from 'framer-motion';
import { MdWarning } from 'react-icons/md';

export function ConfirmProvider() {
  const { confirmState, handleCancel, handleConfirm } = useConfirmStore();

  return (
    <AlertDialog.Root open={confirmState?.isOpen} onOpenChange={(value) => !value && handleCancel()}>
      <AnimatePresence>
        {confirmState?.isOpen && (
          <AlertDialog.Portal forceMount container={document.getElementById('portalSection')!}>
            <AlertDialog.Overlay>
              <DialogOverlay onClick={() => handleCancel()} />
            </AlertDialog.Overlay>

            <AlertDialog.Title />

            <AlertDialog.Content>
              <VisuallyHidden>
                <AlertDialog.AlertDialogDescription>This description is hidden from sighted users but accessible to screen readers.</AlertDialog.AlertDialogDescription>
              </VisuallyHidden>

              <AnimatedDialog modalType="modal" animateType="showAtCenter">
                <FlexibleLayout.Root className="h-fit">
                  <FlexibleLayout.Content className="pt-10">
                    <div className="space-y-8">
                      <MdWarning className="mx-auto size-24 text-purple-100" />

                      <div>
                        <p className="text-center text-2xl font-semibold">{confirmState?.title}</p>
                        <p className="text-center text-lg">{confirmState?.description}</p>
                      </div>
                    </div>
                  </FlexibleLayout.Content>

                  <FlexibleLayout.Footer>
                    <div className="flex gap-3 p-4">
                      <button
                        type="button"
                        className="flex-1 rounded-lg bg-gray-200 py-2 text-xl font-semibold text-black transition-colors"
                        onClick={() => handleCancel()}>
                        취소
                      </button>

                      <button
                        type="button"
                        className="flex-1 rounded-lg bg-pink-400 py-2 text-xl font-semibold text-white transition-colors"
                        onClick={() => handleConfirm()}>
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
