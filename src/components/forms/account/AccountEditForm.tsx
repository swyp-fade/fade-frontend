import ResignServiceView from '@Components/ResignServiceDialog';
import { Button } from '@Components/ui/button';
import { Form } from '@Components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useModalActions } from '@Hooks/modal';
import { useToastActions } from '@Hooks/toast';
import { requestUpdateUserDetails } from '@Services/member';
import { useMutation } from '@tanstack/react-query';
import { TMyUserDetail } from '@Types/model';
import { ServiceErrorResponse } from '@Types/serviceError';
import { isAxiosError } from 'axios';
import { useTransition } from 'react';
import { Control, useForm } from 'react-hook-form';
import { VscLoading } from 'react-icons/vsc';
import { accountEditSchema, AccountEditSchema, AccountSchema } from './_accountSchema';
import { ProfileImageField } from './fields/ProfileImageField';
import { UsernameField } from './fields/UsernameField';

interface TAccountEditForm {
  defaultUserDetails: TMyUserDetail;
  onSubmited: (values: AccountEditSchema) => void;
}

type AccountEditFormProps = TAccountEditForm;

export function AccountEditForm({ defaultUserDetails, onSubmited }: AccountEditFormProps) {
  const startTransition = useTransition()[1];

  const { showToast } = useToastActions();

  const { mutate: updateUserDetails, isPending } = useMutation({
    mutationKey: ['updateUserDetails'],
    mutationFn: requestUpdateUserDetails,
  });

  const form = useForm<AccountEditSchema>({
    resolver: zodResolver(accountEditSchema),
    defaultValues: {
      profileImageId: -1,
      username: defaultUserDetails.username,
    },
    mode: 'onChange',
  });

  const { isValid, errors } = form.formState;
  const couldSubmit = isValid;

  function handleSubmitAfterValidation(values: AccountEditSchema) {
    if (!form.formState.isDirty) {
      return;
    }

    startTransition(() => {
      updateUserDetails(values, {
        onSuccess() {
          onSubmited(values);
        },
        onError(error) {
          showErrorToast(error);
        },
      });
    });
  }

  const showErrorToast = (error: Error) => {
    if (isAxiosError<ServiceErrorResponse>(error) && error.response) {
      const { errorCode } = error.response!.data.result;

      /** TODO: 에러 분기 */
      if (errorCode === 'ALREADY_EXIST_MEMBER_ID') {
        showToast({ type: 'error', title: '이미 존재하는 ID입니다.' });
        return;
      }
    }

    showToast({ type: 'error', title: `알 수 없는 오류(${error.name})`, description: error.message });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmitAfterValidation)} className="h-full space-y-8">
        <fieldset className="flex h-full flex-col gap-5" disabled={isPending}>
          <div className="flex flex-1 flex-col gap-5">
            <ProfileImageField control={form.control as unknown as Control<AccountSchema>} />
            <UsernameField control={form.control as unknown as Control<AccountSchema>} invalid={!!errors?.username} />
            <ResignButton />
          </div>

          <Button type="submit" className="text-xl" disabled={!couldSubmit}>
            {isPending && (
              <div className="flex flex-row items-center justify-center gap-2">
                <VscLoading className="inline-block size-5 animate-spin" />
                <span>전송 중...</span>
              </div>
            )}
            {!isPending && '수정하기'}
          </Button>
        </fieldset>
      </form>
    </Form>
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
