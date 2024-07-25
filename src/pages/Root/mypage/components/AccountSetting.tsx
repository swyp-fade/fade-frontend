import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import testImage from '@Assets/test_fashion_image.jpg';
import { Input } from '@Components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModalActions } from '@Hooks/modal';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { DefaultModalProps } from '@Stores/modal';
import { cn } from '@Utils/index';
import { useTransition } from 'react';
import { Control, useForm } from 'react-hook-form';
import { MdCameraAlt, MdChevronLeft } from 'react-icons/md';
import { z } from 'zod';
import ResignServiceView from './ResignServiceView';

export default function AccountSetting({ onClose }: DefaultModalProps) {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative px-5 py-4">
          <BackButton onClick={onClose} />
          <p className="text-center text-2xl font-semibold">계정 관리</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="flex flex-col p-5">
        <div className="py-10">
          <div style={{ backgroundImage: `url('${testImage}')` }} className="relative mx-auto size-32 rounded-lg bg-cover bg-center bg-no-repeat">
            <button className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 rounded-full bg-gray-100 p-1">
              <MdCameraAlt className="size-5 text-gray-400" />
            </button>
          </div>
        </div>

        <InitializeAccountForm onSubmit={() => {}} />
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

const accountIdRegExp = new RegExp(/^[a-zA-Z0-9._]{4,15}$/);

const formSchema = z.object({
  accountId: z.string().regex(accountIdRegExp, '사용할 수 없는 ID입니다.'),
  sex: z.enum(['men', 'women'], { message: '성별을 선택해주세요.' }),
});

type InitializeAccountFormSchema = z.infer<typeof formSchema>;

function InitializeAccountForm({ onSubmit }: { onSubmit: (values: InitializeAccountFormSchema) => void }) {
  const [pending, startTransition] = useTransition();

  const form = useForm<InitializeAccountFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountId: '',
      sex: 'men',
    },
    mode: 'onChange',
  });

  const { isValid, errors } = form.formState;
  const couldSubmit = isValid && !pending;

  function handleSubmitAfterValidation(values: InitializeAccountFormSchema) {
    startTransition(() => {
      onSubmit(values);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitAfterValidation)} className="flex-1 space-y-8">
        <fieldset className="flex h-full flex-col gap-5" disabled={pending}>
          <div className="flex flex-1 flex-col gap-5">
            <AccountIdField control={form.control} invalid={!!errors?.accountId} />
            <SexField control={form.control} />
            <ResignButton />
          </div>

          <button
            className="group w-full self-end rounded-lg bg-purple-500 py-3 text-xl font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
            disabled={!couldSubmit}
            aria-disabled={!couldSubmit}>
            <span className="inline-block transition-transform group-aria-[disabled=false]:touchdevice:group-active:scale-95 group-aria-[disabled=false]:pointerdevice:group-hover:scale-105 group-aria-[disabled=false]:pointerdevice:group-active:scale-95">
              FADE 시작하기
            </span>
          </button>
        </fieldset>
      </form>
    </Form>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="group absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100"
      onClick={onClick}>
      <MdChevronLeft className="size-6 transition-transform touchdevice:group-active:scale-95 pointerdevice:group-active:scale-95" />
    </button>
  );
}

function AccountIdField({ control, invalid }: { control: Control<InitializeAccountFormSchema>; invalid: boolean }) {
  return (
    <FormField
      control={control}
      name="accountId"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <p className="text-h6 font-semibold">계정 ID</p>
          <FormControl>
            <Input placeholder="계정 ID" {...field} className="peer aria-[invalid=true]:border-pink-400" />
          </FormControl>

          <div className="pl-1 text-xs text-gray-600">
            {invalid && <FormMessage className="text-xs text-pink-400" />}
            {!invalid && field.value === '' && <p>사용할 계정 ID를 입력해주세요.</p>}
            {!invalid && field.value !== '' && <p>사용할 수 있는 ID입니다.</p>}

            <ul className={cn('list-disc pl-5', { ['text-pink-400']: invalid })}>
              <li>영문자, 숫자, 마침표 및 밑줄만 사용 가능</li>
              <li>최소 4자, 최대 30자</li>
            </ul>
          </div>
        </FormItem>
      )}
    />
  );
}

function SexField({ control }: { control: Control<InitializeAccountFormSchema> }) {
  return (
    <FormField
      control={control}
      name="sex"
      render={({ field }) => (
        <FormItem className="space-y-1">
          <p className="text-h6 font-semibold">성별</p>

          <FormControl>
            <RadioGroup.Root defaultValue="men" className="flex w-full flex-row gap-5" value={field.value} onValueChange={field.onChange}>
              <RadioGroup.Item
                value="men"
                className="flex flex-1 items-center justify-center rounded-lg bg-gray-200 py-3 text-black transition-colors data-[state=checked]:bg-violet-500 data-[state=checked]:text-white">
                <p>남자</p>
              </RadioGroup.Item>
              <RadioGroup.Item
                value="women"
                className="flex flex-1 items-center justify-center rounded-lg bg-gray-200 py-3 text-black transition-colors data-[state=checked]:bg-violet-500 data-[state=checked]:text-white">
                <p>여자</p>
              </RadioGroup.Item>
            </RadioGroup.Root>
          </FormControl>

          <p className="pl-1 text-xs text-gray-600">성별을 선택해주세요. 사진의 필터링에 활용되니 사실과 같게 선택해주세요!</p>

          <FormMessage className="text-pink-400" />
        </FormItem>
      )}
    />
  );
}

function ResignButton() {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    await showModal({ type: 'fullScreenDialog', Component: ResignServiceView, animateType: 'slideInFromRight' });
  };

  return (
    <div className="space-y-1 p-1">
      <p className="text-h6 font-semibold">회원 탈퇴</p>
      <button className="font-semibold text-gray-500 underline" onClick={handleClick}>
        페이드 서비스에서 탈퇴하기
      </button>
    </div>
  );
}
