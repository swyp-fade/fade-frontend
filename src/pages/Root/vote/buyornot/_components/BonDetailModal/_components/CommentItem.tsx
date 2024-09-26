import { Button } from '@Components/ui/button';
import { useConfirm } from '@Hooks/modal';
import { useToastActions } from '@Hooks/toast';
import { BoNVotedValue, TBoNComment } from '@Types/model';
import { cn } from '@Utils/index';
import { MdDelete } from 'react-icons/md';
import { VscHeart, VscHeartFilled, VscLoading } from 'react-icons/vsc';
import { useDeleteBoNComment, useLikeBoNComment } from '../service';

interface TCommentItem {
  bonId: number;
}

type CommentItemProps = TBoNComment & TCommentItem;

export function CommentItem({ bonId, anonName, contents, hasLiked, id, isBestComment, likeCount, votedValue, isMine }: CommentItemProps) {
  return (
    <div className="p-5">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <BoNBadge value={votedValue} />
          <span className="font-semibold">익명의 {anonName}</span>
          <div className="flex flex-row items-center gap-1 text-gray-400">
            <VscHeart />
            {likeCount}
          </div>
        </div>

        {!isMine && <CommentLikeButton bonId={bonId} commentId={id} hasLiked={hasLiked} />}
        {isMine && <CommentDeleteButton bonId={bonId} commentId={id} />}
      </div>

      <div className="flex flex-row gap-1">
        {isBestComment && <div>👑</div>}
        <p>{contents}</p>
      </div>
    </div>
  );
}
interface TCommentLikeButton {
  bonId: number;
  commentId: number;
  hasLiked: boolean;
}

type CommentLikeButtonProps = TCommentLikeButton;

function CommentLikeButton({ bonId, commentId, hasLiked }: CommentLikeButtonProps) {
  const { mutate: likeBoNComment } = useLikeBoNComment();

  const handleClick = () => {
    likeBoNComment({
      bonId,
      commentId,
      doesLike: !hasLiked,
    });
  };

  return (
    <Button variants="ghost" onClick={handleClick}>
      {hasLiked && <VscHeartFilled className="size-4 fill-gray-900" />}
      {!hasLiked && <VscHeart className="size-4 fill-gray-900" />}
    </Button>
  );
}

interface TCommentDeleteButton {
  bonId: number;
  commentId: number;
}

type CommentDeleteButtonProps = TCommentDeleteButton;

function CommentDeleteButton({ bonId, commentId }: CommentDeleteButtonProps) {
  const confirm = useConfirm();

  const { showToast } = useToastActions();
  const { mutate: deleteBoNComment, isPending } = useDeleteBoNComment();

  const handleClick = async () => {
    const wouldDelete = await confirm({
      title: '투표 삭제',
      description: '투표 삭제 시 복구가 불가능합니다.\n정말 삭제하시겠습니까?',
    });

    if (wouldDelete) {
      deleteBoNComment(
        { bonId, commentId },
        {
          onSuccess() {
            showToast({
              type: 'basic',
              title: '댓글이 삭제되었습니다.',
            });
          },
        }
      );
    }
  };

  return (
    <Button variants="ghost" className="-translate-y-2 text-grey-500" onClick={handleClick} disabled={isPending}>
      {isPending && <VscLoading className="size-4 animate-spin" />}
      {!isPending && <MdDelete />}
    </Button>
  );
}

interface TBoNBadge {
  value: BoNVotedValue;
}

type BoNBadgeProps = TBoNBadge;

function BoNBadge({ value }: BoNBadgeProps) {
  return (
    <span
      className={cn('w-[3.25rem] rounded-full bg-pink-500 text-center capitalize text-white', {
        ['bg-blue-500']: value === 'YES',
      })}>
      {value}
    </span>
  );
}
