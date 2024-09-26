import { Button } from '@Components/ui/button';
import { Image } from '@Components/ui/image';
import { useConfirm } from '@Hooks/modal';
import { useToastActions } from '@Hooks/toast';
import { TBoNDetail } from '@Types/model';
import { MdDelete } from 'react-icons/md';
import { VscLoading } from 'react-icons/vsc';
import { useDeleteBoN } from '../service';
import { VoteButtonGroup } from './VoteButtonGroup';

interface TBoNContent {
  bonId: number;
  bonDetail: TBoNDetail;
  onDelete: () => void;
}

type BoNContentProps = TBoNContent;

export function BoNContent({ bonId, bonDetail, onDelete }: BoNContentProps) {
  const { commentCount, contents, isMine, imageURL, title, voteCount } = bonDetail;

  return (
    <div className="space-y-3 bg-white p-5">
      <div className="space-y-2">
        <div className="flex flex-row justify-between">
          <p className="text-xl font-semibold">{title}</p>
          {isMine && <BoNDeleteButton bonId={bonId} onDelete={onDelete} />}
        </div>
        <p className="whitespace-pre-line">{contents}</p>
      </div>

      <div className="aspect-square overflow-hidden rounded-md">
        <Image src={imageURL} />
      </div>

      <VoteButtonGroup bonId={bonId} bonDetail={bonDetail} />

      <div className="pt-4">
        <span className="text-sm text-gray-400">
          투표 {voteCount}회 ・ 댓글 {commentCount}개
        </span>
      </div>
    </div>
  );
}

interface TBoNDeleteButton {
  bonId: number;
  onDelete: () => void;
}

type BoNDeleteButtonProps = TBoNDeleteButton;

function BoNDeleteButton({ bonId, onDelete }: BoNDeleteButtonProps) {
  const confirm = useConfirm();
  const { showToast } = useToastActions();
  const { mutate: deleteBoN, isPending } = useDeleteBoN();

  const handleClick = async () => {
    const wouldDelete = await confirm({
      title: '투표 삭제',
      description: '투표 삭제 시 복구가 불가능합니다.\n정말 삭제하시겠습니까?',
    });

    if (!wouldDelete) {
      return;
    }

    deleteBoN(
      { bonId },
      {
        onSuccess() {
          showToast({
            type: 'basic',
            title: '투표가 삭제되었습니다.',
          });

          onDelete();
        },
      }
    );
  };

  return (
    <Button variants="ghost" className="-translate-y-2 text-grey-500" onClick={handleClick} disabled={isPending}>
      {isPending && <VscLoading className="size-4 animate-spin" />}
      {!isPending && <MdDelete />}
    </Button>
  );
}
