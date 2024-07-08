import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { AnimatePresence } from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';
import { DialogOverlay } from '../components/DialogOverlay';
import { UploadView } from './view';

export function UploadViewDialog({ triggerSlot }: { triggerSlot: ReactNode }) {
  const [isOpened, setIsOpened] = useState(false);
  const dirtyRef = useRef(false);

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
            <AlertDialog.Content asChild>
              <UploadView onClose={() => handleOpenChange(false)} onValueChanged={(value) => (dirtyRef.current = value)} />
            </AlertDialog.Content>
          </AlertDialog.Portal>
        )}
      </AnimatePresence>
    </AlertDialog.Root>
  );
}
