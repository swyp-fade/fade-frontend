import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { AnimatePresence } from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';
import { AnimatedDialog } from '../components/AnimatedDialog';
import { DialogOverlay } from '../components/DialogOverlay';
import { UploadImageForm } from './components/UploadImageForm';
import { PolicyView } from './components/UploadPolicyView';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export function UploadViewDialog({ triggerSlot }: { triggerSlot: ReactNode }) {
  const [isOpened, setIsOpened] = useState(false);
  const dirtyRef = useRef(false);

  /** TODO: User 정보로 불러와야 함 */
  const [hasAgreementOfPolicy, setHasAgreementOfPolicy] = useState(false);
  const shouldShowPolicyView = !hasAgreementOfPolicy;

  const handleOpenChange = (wouldOpen: boolean) => {
    if (wouldOpen) {
      dirtyRef.current = false;
      return setIsOpened(true);
    }

    if (dirtyRef.current) {
      const exitResult = confirm('변경되지 않은 머시깽이가 있어요. 그래도 나감?');
      return setIsOpened(!exitResult);
    }

    return setIsOpened(wouldOpen);
  };

  return (
    <AlertDialog.Root open={isOpened} onOpenChange={handleOpenChange}>
      <AlertDialog.Trigger asChild>{triggerSlot}</AlertDialog.Trigger>

      <AnimatePresence>
        {isOpened && (
          <AlertDialog.Portal forceMount container={document.getElementById('rootLayout')!}>
            <DialogOverlay />
            <AlertDialog.Title />
            <AlertDialog.Content>
              <VisuallyHidden>
                <AlertDialog.AlertDialogDescription>This description is hidden from sighted users but accessible to screen readers.</AlertDialog.AlertDialogDescription>
              </VisuallyHidden>

              <AnimatedDialog>
                {shouldShowPolicyView ? (
                  <PolicyView onAgreePolicy={() => setHasAgreementOfPolicy(true)} onDegreePolicy={() => handleOpenChange(false)} />
                ) : (
                  <UploadImageForm onClose={() => handleOpenChange(false)} onValueChanged={(value) => (dirtyRef.current = value)} />
                )}
              </AnimatedDialog>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        )}
      </AnimatePresence>
    </AlertDialog.Root>
  );
}
