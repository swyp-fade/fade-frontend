import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { MdWarning } from 'react-icons/md';

type ConfirmProps = {
  title: string;
  description: string;
};

export function ConfirmModal({ title, description, onClose }: DefaultModalProps<boolean, ConfirmProps>) {
  return (
    <FlexibleLayout.Root className="h-fit">
      <FlexibleLayout.Content className="p-5 pt-10">
        <div className="space-y-8">
          <MdWarning className="mx-auto size-24 text-purple-100" />

          <div>
            <p className="text-center text-2xl font-semibold">{title}</p>
            <p className="text-center text-lg">{description}</p>
          </div>
        </div>
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <div className="flex gap-3 p-4">
          <button type="button" className="group flex-1 rounded-lg bg-gray-200 py-2 text-xl font-semibold text-black transition-colors" onClick={() => onClose(false)}>
            <span className="inline-block transition-transform group-active:scale-95">취소</span>
          </button>

          <button type="button" className="group flex-1 rounded-lg bg-pink-400 py-2 text-xl font-semibold text-white transition-colors" onClick={() => onClose(true)}>
            <span className="inline-block transition-transform group-active:scale-95">확인</span>
          </button>
        </div>
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}
