import { OUTFIT_CATEGORY_LIST } from '@/constants';
import { AnimatedDialog } from '@Components/AnimatedDialog';
import { DialogOverlay } from '@Components/DialogOverlay';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import * as Select from '@radix-ui/react-select';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { AnimatePresence } from 'framer-motion';
import { ChangeEvent, ReactNode, useRef, useState } from 'react';
import { MdChevronRight, MdClose } from 'react-icons/md';

type OutfitFieldSheetProp = {
  type: 'add' | 'edit';
  defaultOutfitField?: OutfitField;
  triggerSlot: ReactNode;
  onSubmit?: (outfitField: OutfitField) => void;
  onDelete?: () => void;
  onEdit?: (outfitField: OutfitField) => void;
};

type OutfitField = {
  id?: string;
  category: number;
  brandName: string;
  details: string;
};

const initialOutfitField: OutfitField = { category: -1, brandName: '', details: '' };

export function OutfitFieldSheet({ type, triggerSlot, defaultOutfitField = initialOutfitField, onSubmit, onDelete, onEdit }: OutfitFieldSheetProp) {
  const [isOpened, setIsOpened] = useState(false);
  const [outfitField, setOutfitField] = useState(defaultOutfitField);

  const submitType = useRef<string>(type);

  const updateOutfitField = (field: Partial<OutfitField>) => setOutfitField((prevField) => ({ ...prevField, ...field }));

  const isAddSheet = type === 'add';
  const isEditSheet = type === 'edit';

  const doneSelectCategory = outfitField.category != -1;
  const doneInputBrandName = outfitField.brandName !== '';
  const couldEnableAddButton = doneSelectCategory && doneInputBrandName;

  const hasDirtyCategory = outfitField.category !== defaultOutfitField.category;
  const hasDirtyBrandName = outfitField.brandName !== defaultOutfitField.brandName;
  const hasDirtyDetails = outfitField.details !== defaultOutfitField.details;
  const couldEnableEditButton = hasDirtyCategory || hasDirtyBrandName || hasDirtyDetails;

  const closeSheet = (type: string) => {
    submitType.current = type;
    setIsOpened(false);
  };

  const handleAfterExit = () => {
    setOutfitField(defaultOutfitField);

    if (submitType.current === 'add') {
      return onSubmit && onSubmit(outfitField);
    }

    if (submitType.current === 'delete') {
      return onDelete && onDelete();
    }

    if (submitType.current === 'edit') {
      return onEdit && onEdit(outfitField);
    }
  };

  return (
    <AlertDialog.Root open={isOpened} onOpenChange={setIsOpened}>
      {triggerSlot && <AlertDialog.Trigger asChild>{triggerSlot}</AlertDialog.Trigger>}

      <AnimatePresence onExitComplete={handleAfterExit}>
        {isOpened && (
          <AlertDialog.Portal forceMount container={document.getElementById('portalSection')!}>
            <AlertDialog.Overlay>
              <DialogOverlay onClick={() => closeSheet('cancel')} />
            </AlertDialog.Overlay>

            <AlertDialog.Title />

            <AlertDialog.Content>
              <VisuallyHidden>
                <AlertDialog.AlertDialogDescription>This description is hidden from sighted users but accessible to screen readers.</AlertDialog.AlertDialogDescription>
              </VisuallyHidden>

              <AnimatedDialog modalType="bottomSheet">
                <FlexibleLayout.Root className="h-fit">
                  <FlexibleLayout.Header>
                    <header className="relative flex flex-row justify-between px-5 py-4">
                      <p className="text-xl font-semibold">
                        {isAddSheet && '착장 정보 추가'}
                        {isEditSheet && '착장 정보 편집'}
                      </p>
                      <button type="button" onClick={() => closeSheet('cancel')}>
                        <MdClose className="size-6 text-gray-600" />
                      </button>
                    </header>
                  </FlexibleLayout.Header>

                  <FlexibleLayout.Content className="flex flex-col gap-3">
                    <div className="flex flex-row gap-3">
                      <CategorySelect categoryId={outfitField.category} onSelect={(category) => updateOutfitField({ category })} />
                      <BrandNameField value={outfitField.brandName} disabled={outfitField.category === -1} onChange={(brandName) => updateOutfitField({ brandName })} />
                    </div>

                    <DetailField value={outfitField.details} disabled={outfitField.brandName === ''} onChange={(details) => updateOutfitField({ details })} />
                  </FlexibleLayout.Content>

                  <FlexibleLayout.Footer>
                    <div className="flex p-4 pt-0">
                      {isAddSheet && <AddOutfitButton disabled={!couldEnableAddButton} onAdd={() => closeSheet('add')} />}
                      {isEditSheet && <DeleteOrEditButton onDelete={() => closeSheet('delete')} onEdit={() => closeSheet('edit')} disabled={!couldEnableEditButton} />}
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

function CategorySelect({ categoryId, onSelect }: { categoryId: number; onSelect: (categoryId: number) => void }) {
  return (
    <Select.Root defaultValue={categoryId !== -1 ? String(categoryId) : undefined} onValueChange={(value) => onSelect(Number(value))}>
      <Select.Trigger className="flex w-[30%] max-w-[8rem] flex-row items-center justify-between rounded-md border border-gray-200 px-3 py-3 text-gray-600">
        <Select.Value placeholder="카테고리" />
        <Select.Icon asChild>
          <MdChevronRight className="rotate-90" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content>
          <Select.ScrollUpButton />
          <Select.Viewport className="flex flex-col gap-2 rounded-md border bg-white px-2 py-2">
            {OUTFIT_CATEGORY_LIST.map((category, index) => (
              <Select.Item key={category} value={index.toString()} className="cursor-pointer rounded-sm px-2 py-2 transition-colors pointerdevice:hover:bg-gray-100">
                <Select.ItemText>{category}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function BrandNameField({ value, disabled, onChange }: { value: string; disabled: boolean; onChange: (value: string) => void }) {
  return (
    <input
      type="text"
      className="w-full rounded-md border border-gray-200 px-3 py-3 transition-colors disabled:bg-gray-300 disabled:text-gray-500"
      placeholder="브랜드"
      disabled={disabled}
      defaultValue={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function DetailField({ value, disabled, onChange }: { value: string; disabled: boolean; onChange: (value: string) => void }) {
  const [textLength, setTextLength] = useState(0);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextLength(e.target.value.length);
    onChange(e.target.value);
  };

  return (
    <div
      className="relative w-full rounded-lg bg-gray-100 p-3 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-purple-700 aria-[disabled=true]:bg-gray-300"
      aria-disabled={disabled}>
      <textarea
        className="relative h-[5rem] w-full resize-none bg-transparent align-text-top outline-none transition-colors disabled:bg-gray-300 disabled:text-gray-500"
        placeholder="구매처, 상품코드 등 상세 정보를 간략히 입력해주세요."
        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
        onChange={handleChange}
        aria-disabled={disabled}
        disabled={disabled}
        defaultValue={value}
        maxLength={20}
      />
      <span className="absolute bottom-3 right-3 text-xs text-gray-400">{textLength} / 20</span>
    </div>
  );
}

function AddOutfitButton({ disabled, onAdd }: { disabled: boolean; onAdd: () => void }) {
  return (
    <button
      type="button"
      className="flex-1 rounded-lg bg-purple-700 py-2 text-xl text-white transition-colors disabled:bg-gray-300 disabled:text-gray-500"
      onClick={onAdd}
      disabled={disabled}>
      추가
    </button>
  );
}

function DeleteOrEditButton({ disabled, onDelete, onEdit }: { disabled: boolean; onDelete: () => void; onEdit: () => void }) {
  return (
    <div className="flex w-full justify-end">
      <button className="rounded-lg bg-white px-10 py-3 text-xl font-semibold text-pink-400" onClick={onDelete}>
        삭제
      </button>
      <button
        className="rounded-lg bg-purple-700 px-10 py-3 text-xl font-semibold text-white transition-colors disabled:bg-gray-300 disabled:text-gray-500"
        onClick={onEdit}
        disabled={disabled}>
        수정
      </button>
    </div>
  );
}
