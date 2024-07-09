import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { SelectStyleView } from './view';
import { OutfitStyle } from '@Types/outfitStyle';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

type SelectStyleDialogProp = {
  triggerSlot: ReactNode;
  defaultStyles: OutfitStyle[];
  onStylesSelected: (styles: OutfitStyle[]) => void;
};

export function SelectStyleDialog({ triggerSlot, defaultStyles, onStylesSelected }: SelectStyleDialogProp) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <AlertDialog.Root open={isOpened} onOpenChange={setIsOpened}>
      <AlertDialog.Trigger asChild>{triggerSlot}</AlertDialog.Trigger>

      <AnimatePresence>
        {isOpened && (
          <AlertDialog.Portal forceMount container={document.getElementById('portalSection')!}>
            <AlertDialog.Title />
            <AlertDialog.Content>
              <VisuallyHidden>
                <AlertDialog.AlertDialogDescription>This description is hidden from sighted users but accessible to screen readers.</AlertDialog.AlertDialogDescription>
              </VisuallyHidden>

              <SelectStyleView
                defaultStyles={defaultStyles}
                onClose={(styles) => {
                  onStylesSelected(styles);
                  setIsOpened(false);
                }}
              />
            </AlertDialog.Content>
          </AlertDialog.Portal>
        )}
      </AnimatePresence>
    </AlertDialog.Root>
  );
}
