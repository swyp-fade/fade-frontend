import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { OUTFIT_CATEGORY_LIST, OUTFIT_STYLE_MAP } from '@/constants';
import { ToggleButton } from '@Components/ui/toogleButton';
import { zodResolver } from '@hookform/resolvers/zod';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import * as Select from '@radix-ui/react-select';
import { OutfitStyle } from '@Types/outfitStyle';
import { forwardRef, useEffect, useTransition } from 'react';
import { Control, useFieldArray, useForm } from 'react-hook-form';
import { MdChevronRight, MdClose, MdInfoOutline } from 'react-icons/md';
import { z } from 'zod';
import { AnimatedDialog } from '../components/AnimatedDialog';
import { SelectStyleDialog } from '../SelectStyleDialog/dialog';
import { InputImageFile } from './components/InputImageFile';

/** 착장 정보 스키마 */
const outfitItemSchema = z
  .object({
    category: z.number(),
    brandName: z.string(),
    details: z.string(),
  })
  .refine(
    ({ category, brandName }) => {
      const doseNotSelectCategory = category === -1;
      const doseInputBrandName = !doseNotSelectCategory && brandName !== '';

      return doseNotSelectCategory || doseInputBrandName;
    },
    { path: ['brandName'] }
  );

type OutfitItemSchema = z.infer<typeof outfitItemSchema>;

const initialOutfitDetailItem: OutfitItemSchema = { category: -1, brandName: '', details: '' };

/** 사진 업로드 스키마 */
const formSchema = z.object({
  image: z.string().refine((value) => value !== '', '사진을 선택해주세요.'),
  styles: z.array(z.number()), // Optional
  outfits: z.array(outfitItemSchema), // Optional
});

type UploadImageSchema = z.infer<typeof formSchema>;

type UploadViewProps = { onClose: () => void; onValueChanged: (isChanged: boolean) => void };

export const UploadView = forwardRef(({ onClose, onValueChanged }: UploadViewProps, ref) => {
  const [pending, startTransition] = useTransition();

  const form = useForm<UploadImageSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: undefined,
      styles: [],
      outfits: [{ ...initialOutfitDetailItem }],
    },
    mode: 'onChange',
  });

  const { styles } = form.watch();
  const { isDirty, isValid } = form.formState;

  /** 정보 입력 후 나가기 방지 */
  useEffect(() => {
    onValueChanged(isDirty);
  }, [isDirty]);

  function handleSubmitAfterValidation(values: UploadImageSchema) {
    startTransition(() => {
      console.log(values);
      // onSubmit(values);
    });
  }

  const { fields: outfitFields, append } = useFieldArray({ name: 'outfits', control: form.control });

  const watchedOutfits = form.watch('outfits');

  const couldNotAddOutfitDetail = watchedOutfits.some(({ category, brandName }) => {
    const doseNotSelectCategory = category === -1;
    const doseNotInputBrandName = !doseNotSelectCategory && brandName === '';

    return doseNotSelectCategory || doseNotInputBrandName;
  });

  return (
    <AnimatedDialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmitAfterValidation)} className="h-full space-y-8">
          <fieldset className="flex h-full min-w-full flex-col gap-5" disabled={pending}>
            <FlexibleLayout.Root>
              <FlexibleLayout.Header>
                <Header onClose={onClose} />
              </FlexibleLayout.Header>

              <FlexibleLayout.Content className="space-y-8">
                <AddImageField control={form.control} />
                <SelectStylesField selectedStyles={styles as unknown as OutfitStyle[]} control={form.control} />

                <div className="space-y-3">
                  <FormLabel className="text-lg font-semibold">착장 정보</FormLabel>
                  <div className="space-y-2">
                    {outfitFields.map((outfitField, index) => (
                      <div key={outfitField.id} className="flex max-w-full flex-row gap-x-2">
                        <CategoryField control={form.control} index={index} />
                        <BrandNameField control={form.control} index={index} disabled={watchedOutfits[index].category === -1} />
                        <DetailField control={form.control} index={index} disabled={watchedOutfits[index].brandName === ''} />
                      </div>
                    ))}
                  </div>

                  <AddOutfitDetailButton disabled={couldNotAddOutfitDetail} onClick={() => append({ ...initialOutfitDetailItem })} />
                </div>
              </FlexibleLayout.Content>

              <FlexibleLayout.Footer>
                <UploadButton disabled={!isValid} />
                {/* <UploadButton disabled={false} /> */}
              </FlexibleLayout.Footer>
            </FlexibleLayout.Root>
          </fieldset>
        </form>
      </Form>
    </AnimatedDialog>
  );
});

function Header({ onClose }: { onClose: () => void }) {
  return (
    <header className="relative px-5 py-4">
      <button className="absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 hover:bg-gray-200" onClick={onClose}>
        <MdClose className="size-6" />
      </button>

      <p className="text-center text-2xl font-semibold">사진 업로드</p>

      <button className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 hover:bg-gray-200">
        <MdInfoOutline className="size-6" />
      </button>
    </header>
  );
}

function UploadButton({ disabled }: { disabled: boolean }) {
  return (
    <div className="flex p-4">
      <button
        className="flex-1 rounded-lg bg-black py-2 text-xl text-white transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:pointerdevice:cursor-not-allowed"
        disabled={disabled}>
        업로드
      </button>
    </div>
  );
}

function AddOutfitDetailButton({ onClick, disabled }: { onClick: () => void; disabled: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-gray-200 py-3 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
      disabled={disabled}>
      정보 추가
    </button>
  );
}

/** Fields */

function AddImageField({ control }: { control: Control<UploadImageSchema> }) {
  return (
    <FormField
      control={control}
      name="image"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-lg font-semibold">사진 추가</FormLabel>

          <div>
            <FormControl>
              <InputImageFile value={field.value} onChange={field.onChange} />
            </FormControl>

            <p className="mt-1 pl-2 text-xs text-gray-600">※ 업로드 후에는 사진 수정이 불가하니 가이드에 맞추어 신중히 업로드해주세요!</p>
          </div>

          <FormMessage className="text-pink-400" />
        </FormItem>
      )}
    />
  );
}

function SelectStylesField({ selectedStyles, control }: { selectedStyles: OutfitStyle[]; control: Control<UploadImageSchema> }) {
  const hasSelectedStyles = selectedStyles.length !== 0;

  return (
    <FormField
      control={control}
      name="styles"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="mb-3 text-lg font-semibold">스타일</FormLabel>

          {hasSelectedStyles && (
            <ul className="flex flex-row flex-wrap gap-x-2 gap-y-3">
              {selectedStyles.map((selectedStyle) => (
                <li key={selectedStyle}>
                  <ToggleButton selected={true}>{OUTFIT_STYLE_MAP[selectedStyle]}</ToggleButton>
                </li>
              ))}
            </ul>
          )}

          <FormControl>
            <SelectStyleDialog
              triggerSlot={
                <button className="relative block w-full rounded-lg border border-gray-200 bg-white py-3">
                  스타일 선택하기
                  <MdChevronRight className="absolute right-3 top-1/2 size-6 -translate-y-1/2" />
                </button>
              }
              defaultStyles={selectedStyles}
              onStylesSelected={(styles) => field.onChange(styles)}
            />
          </FormControl>
          <FormMessage className="text-pink-400" />
        </FormItem>
      )}
    />
  );
}

function CategoryField({ index, control }: { index: number; control: Control<UploadImageSchema> }) {
  return (
    <FormField
      control={control}
      name={`outfits.${index}.category`}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormControl>
            <Select.Root onValueChange={(value) => field.onChange(Number(value))}>
              <Select.Trigger className="flex w-full flex-row items-center justify-between rounded-md border border-gray-200 px-3 py-3 text-gray-600">
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
                      <Select.Item
                        key={category}
                        value={index.toString()}
                        className="cursor-pointer rounded-sm px-2 py-2 transition-colors pointerdevice:hover:bg-gray-100">
                        <Select.ItemText>{category}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </FormControl>
          <FormMessage className="text-pink-400" />
        </FormItem>
      )}
    />
  );
}

function BrandNameField({ disabled, index, control }: { disabled: boolean; index: number; control: Control<UploadImageSchema> }) {
  return (
    <FormField
      control={control}
      name={`outfits.${index}.brandName`}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormControl>
            <input
              type="text"
              className="w-full rounded-md border border-gray-200 px-3 py-3 disabled:bg-gray-100 disabled:text-gray-400 aria-[invalid=true]:border-pink-500"
              placeholder="브랜드"
              disabled={disabled}
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

function DetailField({ disabled, index, control }: { disabled: boolean; index: number; control: Control<UploadImageSchema> }) {
  return (
    <FormField
      control={control}
      name={`outfits.${index}.details`}
      render={({ field }) => (
        <FormItem className="flex-[2_1_0%]">
          <FormControl>
            <input
              className="w-full rounded-md border border-gray-200 px-3 py-3 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
              placeholder="구매처, 상품코드 등 상세 정보"
              disabled={disabled}
              value={field.value}
              onChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
