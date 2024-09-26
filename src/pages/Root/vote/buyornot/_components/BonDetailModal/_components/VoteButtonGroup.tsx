import { useConfirm } from '@Hooks/modal';
import { BoNVotedValue, TBoNDetail } from '@Types/model';
import { useState } from 'react';
import { useVoteBoN } from '../service';
import { cn } from '@Utils/index';
import { motion } from 'framer-motion';
import { MdCheck } from 'react-icons/md';

interface TVoteButtonGroup {
  bonId: number;
  bonDetail: TBoNDetail;
}

type TVoteButtonGroupProps = TVoteButtonGroup;

export function VoteButtonGroup({ bonId, bonDetail }: TVoteButtonGroupProps) {
  const confirm = useConfirm();

  const {
    myVotedValue: initialVotedValue,
    bonCount: { no: noCount, yes: yesCount },
    isMine,
    hasCommented,
  } = bonDetail;

  const [currentVotedValue, setCurrentVotedValue] = useState<BoNVotedValue>(initialVotedValue);
  const hasVoted = currentVotedValue !== 'NOT';

  const { mutate: voteBoN } = useVoteBoN({ currentVotedValue, hasVoted });

  const handleClick = (value: BoNVotedValue) => {
    if (isMine) {
      return;
    }

    if (hasCommented) {
      return confirm({
        title: '댓글을 단 이후에는 투표를 수정할 수 없어요',
        description: '다른 투표를 하고 싶다면 댓글을 삭제해주세요.',
      });
    }

    const newVotedValue = hasVoted && currentVotedValue === value ? 'NOT' : value;

    voteBoN({ bonId, votedValue: newVotedValue });
    setCurrentVotedValue(newVotedValue);
  };

  return (
    <div className="flex flex-row gap-4">
      <BoNVoteButton
        bonId={bonId}
        variants={hasVoted ? 'afterVote' : 'beforeVote'}
        value="NO"
        checked={currentVotedValue === 'NO'}
        bonCount={[noCount, yesCount]}
        isMine={isMine}
        onClick={() => handleClick('NO')}
      />

      <BoNVoteButton
        bonId={bonId}
        variants={hasVoted ? 'afterVote' : 'beforeVote'}
        value="YES"
        checked={currentVotedValue === 'YES'}
        bonCount={[noCount, yesCount]}
        isMine={isMine}
        onClick={() => handleClick('YES')}
      />
    </div>
  );
}

interface TBoNVoteButton {
  bonId: number;
  variants: 'beforeVote' | 'afterVote';
  value: BoNVotedValue;
  bonCount?: [number, number];
  checked?: boolean;
  isMine?: boolean;
  onClick: () => void;
}

type BoNVoteButtonProps = TBoNVoteButton;

/**
 * 투표를 하지 않았으면
 *    votedCount 증가
 *    선택한 bonCount 증가
 *
 * 투표를 했으면
 *    같은 Value를 클릭했으면
 *      votedCount 감소
 *      선택한 bonCount 감소
 *    다른 Value를 클릭했으면
 *      votedCount 유지
 *      선택한 bonCount 유지
 *      다른 bonCount 증가
 */

function BoNVoteButton({ onClick, value, variants, bonCount: [noCount, yesCount] = [0, 0], checked, isMine = false }: BoNVoteButtonProps) {
  const voteCount = noCount + yesCount;

  const isBeforeVote = variants === 'beforeVote';
  const isAfterVote = variants === 'afterVote';

  const isNo = value === 'NO';
  const isYes = value === 'YES';

  const noRatio = Math.floor((noCount / (voteCount || 1)) * 100);
  const yesRatio = Math.floor((yesCount / (voteCount || 1)) * 100);

  const isLowerThenOther = (() => {
    if (isNo) {
      return noCount < yesCount;
    }

    if (isYes) {
      return noCount > yesCount;
    }
  })();

  const shouldShowRatio = isAfterVote || isMine;

  return (
    <button
      className={cn('relative h-11 flex-1 overflow-hidden rounded-full border border-gray-500 px-5 py-2 text-gray-900', {
        ['border-gray-500 text-gray-900']: isBeforeVote,
        ['border-blue-400 text-blue-400']: shouldShowRatio && value === 'NO',
        ['border-purple-400 text-purple-400']: shouldShowRatio && value === 'YES',
        ['border-gray-400 text-gray-400']: !isMine && isAfterVote && isLowerThenOther, // 우선순위
      })}
      onClick={onClick}>
      {shouldShowRatio && (
        <motion.div
          className={cn('absolute inset-0', {
            ['bg-blue-50']: value === 'NO',
            ['bg-purple-50']: value === 'YES',
            ['bg-gray-100']: !isMine && isLowerThenOther,
          })}
          initial={{ width: 0 }}
          animate={{ width: `${isNo ? noRatio : yesRatio}%` }}
        />
      )}

      <div
        className={cn('flew-row absolute flex items-center', {
          ['left-4 top-1/2 -translate-y-1/2']: shouldShowRatio,
          ['left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2']: !shouldShowRatio,
        })}>
        {checked && <MdCheck className="mr-2" />}
        <span className="capitalize">{value}</span>
      </div>

      {shouldShowRatio && <span className="absolute right-4 top-1/2 -translate-y-1/2">{isNo ? noRatio : yesRatio}%</span>}
    </button>
  );
}
