import { TBoNDetail } from '@Types/model';
import { cn } from '@Utils/index';
import { ComponentProps, FormEvent, useState } from 'react';
import { useAddBoNComment } from '../service';

interface TCommentBox {
  bonId: number;
  bonDetail: TBoNDetail;
}

type CommentBoxProps = TCommentBox;

export function CommentBox({ bonId, bonDetail }: CommentBoxProps) {
  const { hasCommented, isMine, myVotedValue: votedValue } = bonDetail;

  const { mutate: addBoNComment, isPending } = useAddBoNComment({ votedValue });
  const [contents, setContents] = useState('');

  const hasVoted = votedValue !== 'NOT';
  const couldComment = hasVoted && !hasCommented;
  const haveContents = contents.length !== 0;

  const handeSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addBoNComment(
      {
        bonId,
        contents,
      },
      {
        onSettled() {
          setContents('');
        },
      }
    );
  };

  if (isMine) {
    return <></>;
  }

  return (
    <form onSubmit={handeSubmit} className="p-2">
      <fieldset className="flex flex-row gap-3" disabled={isPending}>
        <CommentInput
          className="w-full flex-1"
          placeholder={getPlaceholderContent({ hasCommented, hasVoted })}
          value={contents}
          disabled={!couldComment}
          onInput={({ target }) => setContents((target as HTMLInputElement).value)}
        />
        <CommentSubmitButton disabled={!couldComment || !haveContents} />
      </fieldset>
    </form>
  );
}

type CommentInputProps = ComponentProps<'input'>;
function CommentInput({ className, ...props }: CommentInputProps) {
  return (
    <input
      className={cn(
        'appearance-none rounded-lg border border-gray-200 px-4 py-2 text-gray-900 focus-within:border-purple-400 disabled:border-grey-200 disabled:bg-grey-300',
        className
      )}
      {...props}
    />
  );
}

type CommentSubmitProps = ComponentProps<'button'>;
function CommentSubmitButton({ className, disabled, ...props }: CommentSubmitProps) {
  return (
    <button
      type="submit"
      className={cn('min-w-fit rounded-lg bg-gray-900 px-4 py-2 font-medium text-white transition-colors disabled:bg-grey-300 disabled:text-gray-500', className)}
      disabled={disabled}
      {...props}>
      게시
    </button>
  );
}

type GetPlaceholderContentProps = { hasCommented: boolean; hasVoted: boolean };
function getPlaceholderContent({ hasCommented, hasVoted }: GetPlaceholderContentProps) {
  if (hasCommented) {
    return '댓글은 하나만 남길 수 있어요.';
  }

  if (hasVoted) {
    return '댓글을 입력해주세요.';
  }

  return '투표하면 댓글을 남길 수 있어요.';
}
