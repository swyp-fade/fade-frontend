import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { FadeLogo } from '@Components/FadeLogo';
import { Input } from '@Components/ui/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthActions } from '@Hooks/auth';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { requestSignUp, SignUpType } from '@Services/authAPI';
import { tryCatcher } from '@Utils/index';
import { useTransition } from 'react';
import { Control, useForm } from 'react-hook-form';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

export default function Page() {
  const navigate = useNavigate();

  const { signIn } = useAuthActions();

  const [searchParams] = useSearchParams();
  const authorizationCode = searchParams.get('code');

  if (authorizationCode === null || authorizationCode === '') {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (values: InitializeAccountFormSchema) => {
    const [response, errorCode] = await tryCatcher(() =>
      requestSignUp({
        ...values,
        signUpType: SignUpType.KAKAO,
        authorizationCode,
      })
    );

    if (response) {
      signIn(response.data);
      return navigate('/', { replace: true });
    }

    if (errorCode) {
      if (errorCode === 'account_already_exists') {
        return alert('토스트 예정: 이미 있는 계정 ID에용!');
      }

      throw new Error(errorCode);
    }
  };

  return (
    <section>
      <header className="border-b border-b-gray-200 px-5 py-4">
        <FadeLogo />
      </header>

      <section className="p-5">
        <InitializeAccountForm onSubmit={handleSubmit} />
      </section>
    </section>
  );
}

const formSchema = z.object({
  accountId: z
    .string()
    .min(4, {
      message: '최소 4글자 이상의 계정 ID로 설정해주세요.',
    })
    .max(15, {
      message: '최대 15글자 이하의 계정 ID로 설정해주세요.',
    }),
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
  });

  function handleSubmitAfterValidation(values: InitializeAccountFormSchema) {
    startTransition(() => {
      onSubmit(values);
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitAfterValidation)} className="space-y-8">
        <fieldset className="flex flex-col gap-5" disabled={pending}>
          <AccountIdField control={form.control} />
          <SexField control={form.control} />

          <button className="rounded-lg bg-violet-500 py-2 text-[1.25rem] text-white">FADE 시작하기</button>
        </fieldset>
      </form>
    </Form>
  );
}

function AccountIdField({ control }: { control: Control<InitializeAccountFormSchema> }) {
  return (
    <FormField
      control={control}
      name="accountId"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input placeholder="계정 ID" {...field} className="aria-[invalid=true]:border-pink-400" />
          </FormControl>

          <div className="mt-2 pl-2 text-xs text-gray-600">
            <p>사용할 계정 ID를 입력해주세요.</p>
            <ul className="list-disc pl-5">
              <li>영문자, 숫자, 마침표 및 밑줄만 사용 가능</li>
              <li>최소 4자, 최대 30자</li>
            </ul>
          </div>

          <FormMessage className="text-pink-400" />
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
        <FormItem>
          <FormControl>
            <ToggleGroup.Root type="single" className="flex w-full flex-row gap-5" value={field.value} onValueChange={field.onChange}>
              <ToggleGroup.Item
                value="men"
                className="flex flex-1 items-center justify-center rounded-lg bg-gray-200 py-3 text-black transition-colors data-[state=on]:bg-violet-500 data-[state=on]:text-white">
                <p>남자</p>
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="women"
                className="flex flex-1 items-center justify-center rounded-lg bg-gray-200 py-3 text-black transition-colors data-[state=on]:bg-violet-500 data-[state=on]:text-white">
                <p>여자</p>
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </FormControl>

          <p className="mt-2 pl-2 text-xs text-gray-600">성별을 선택해주세요. 사진의 필터링에 활용되니 사실과 같게 선택해주세요!</p>

          <FormMessage className="text-pink-400" />
        </FormItem>
      )}
    />
  );
}
