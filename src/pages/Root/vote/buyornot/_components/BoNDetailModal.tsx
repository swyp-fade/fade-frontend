import { BackButton, Button } from '@Components/ui/button';
import { Image } from '@Components/ui/image';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { cn } from '@Utils/index';
import { MdCheck } from 'react-icons/md';
import { VscHeart } from 'react-icons/vsc';

interface TBoNDetailModal {
  bonId: number;
}

type BoNDetailModalProps = DefaultModalProps<void, TBoNDetailModal>;

export function BoNDetailModal({ bonId, onClose }: BoNDetailModalProps) {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative flex items-center justify-center border-b border-b-gray-200 py-2">
          <BackButton onClick={() => onClose()} />
          <span className="mx-auto text-h4 font-semibold">투표 상세</span>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content className="space-y-2 bg-gray-100">
        <BoNContent bonId={bonId} />
        <BestCommentList />
        <AllCommentList />
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <div className="p-2">
          <input className="w-full rounded-lg border border-gray-100 bg-gray-200 px-3 py-2" placeholder="투표하면 댓글을 남길 수 있어요." disabled={true} />
        </div>
      </FlexibleLayout.Footer>
    </FlexibleLayout.Root>
  );
}

interface TBoNContent {
  bonId: number;
}

type BoNContentProps = TBoNContent;

function BoNContent({ bonId }: BoNContentProps) {
  return (
    <div className="space-y-3 bg-white p-5">
      <div className="space-y-2">
        <p className="text-xl font-semibold">남친 생일선물</p>
        <p>20대 후반 직장인 남친 생일선물로 괜찮을까요?? 사귄지는 1년 됐는데 부담스러울까요?ㅠㅠ</p>
      </div>

      <div className="aspect-square">
        <Image src="/assets/test_fashion_image.jpg" />
      </div>

      <div className="flex flex-row gap-4">
        <button className="relative flex flex-1 flex-row justify-between overflow-hidden rounded-full border border-gray-400 px-5 py-2 text-gray-400">
          {/* <div className="absolute inset-0 bg-gray-100" style={{ width: '30%' }} /> */}

          <span>Yes</span>
          <span>30%</span>
        </button>

        <button className="relative flex flex-1 flex-row items-center justify-between overflow-hidden rounded-full border border-purple-400 px-5 py-2 text-purple-400">
          <div className="absolute inset-0 bg-purple-50" style={{ width: '70%' }} />

          <div className="flew-row flex items-center">
            <MdCheck className="mr-2" />
            <span>No</span>
          </div>

          <span>70%</span>
        </button>
      </div>

      <div className="pt-4">
        <span className="text-sm text-gray-400">투표 20회 / 댓글 4개</span>
      </div>
    </div>
  );
}

function BestCommentList() {
  return (
    <div className="bg-white py-5">
      <p className="pl-5 text-lg font-semibold">Best 댓글</p>

      <ul className="divide-y divide-gray-200">
        <li>
          <CommentItem isBestComment={true} />
        </li>
        <li>
          <CommentItem isYes={true} />
        </li>
      </ul>
    </div>
  );
}

function AllCommentList() {
  return (
    <div className="bg-white py-5">
      <p className="pl-5 text-lg font-semibold">전체 댓글</p>

      <ul className="divide-y divide-gray-200">
        <li>
          <CommentItem isBestComment={true} />
        </li>
        <li>
          <CommentItem isYes={true} />
        </li>
      </ul>
    </div>
  );
}

interface TCommentItem {
  id: number;
  annonName: string;
  contents: string;
  likeCount: number;
  isYes: boolean;
  isBestComment: boolean;
  isMine: boolean;
  hasLiked: boolean;
  createdAt: Date;
}

type CommentItemProps = TCommentItem;

function CommentItem({ annonName, contents, createdAt, hasLiked, id, isBestComment, isMine, isYes, likeCount }: CommentItemProps) {
  return (
    <div className="p-5">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <BoNBadge value={isYes ? 'yes' : 'no'} />
          <span className="font-semibold">익명의 빈센트 반 고흐</span>
          <div className="flex flex-row items-center gap-1 text-gray-400">
            <VscHeart />
            10
          </div>
        </div>

        <Button variants="ghost" interactive="onlyScale">
          <VscHeart className="size-4 fill-gray-900" />
        </Button>
      </div>

      <div className="flex flex-row gap-1">
        {isBestComment && <div>👑</div>}
        <p>이건 진짜 너무 유행템이라 꼭 사야됨 남친도 좋아할듯? 패션 관심 없는 사람이어도 이건 일단 이뻐서 좋아함 경험담임 ㄹㅇㅋㅋㅋ</p>
      </div>
    </div>
  );
}

interface TBoNBadge {
  value: 'yes' | 'no';
}

type BoNBadgeProps = TBoNBadge;

function BoNBadge({ value }: BoNBadgeProps) {
  return (
    <span
      className={cn('w-[3.25rem] rounded-full bg-pink-500 text-center capitalize text-white', {
        ['bg-blue-500']: value === 'yes',
      })}>
      {value}
    </span>
  );
}
