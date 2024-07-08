import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { AnimatePresence } from 'framer-motion';
import { ReactNode, useState } from 'react';
import { SelectStyleView } from './view';
import { OutfitStyle } from '@Types/outfitStyle';

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
          <AlertDialog.Portal forceMount container={document.getElementById('rootLayout')!}>
            <AlertDialog.Title />
            <AlertDialog.Content asChild>
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
