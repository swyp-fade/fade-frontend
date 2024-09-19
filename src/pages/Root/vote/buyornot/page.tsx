import { Image } from '@Components/ui/image';
import { useModalActions } from '@Hooks/modal';
import { useHeader } from '@Hooks/useHeader';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { cn } from '@Utils/index';
import { MdEdit } from 'react-icons/md';
import { VoteSubPageList } from '../_components/VoteSubPageList';
import { BoNDetailModal } from './_components/BoNDetailModal';
import { UploadBoNModal } from './_components/UploadBoNModal';
import { SelectBox } from './_components/SelectBox';

const bonDatas = [
  {
    id: 0,
    commentCount: 1,
    hasVoted: false,
    imageURL: '/assets/test_fashion_image.jpg',
    isHotBoN: false,
    title: '테스트 투표',
    voteCount: 1,
  },
  {
    id: 1,
    commentCount: 1,
    hasVoted: true,
    imageURL: '/assets/test_fashion_image.jpg',
    isHotBoN: true,
    title: '테스트 투표',
    voteCount: 1,
  },
  {
    id: 2,
    commentCount: 1,
    hasVoted: false,
    imageURL: '/assets/test_fashion_image.jpg',
    isHotBoN: true,
    title: '테스트 투표',
    voteCount: 1,
  },
  {
    id: 3,
    commentCount: 1,
    hasVoted: false,
    imageURL: '/assets/test_fashion_image.jpg',
    isHotBoN: false,
    title: '테스트 투표',
    voteCount: 1,
  },
  {
    id: 4,
    commentCount: 1,
    hasVoted: false,
    imageURL: '/assets/test_fashion_image.jpg',
    isHotBoN: false,
    title: '테스트 투표',
    voteCount: 1,
  },
  {
    id: 5,
    commentCount: 1,
    hasVoted: true,
    imageURL: '/assets/test_fashion_image.jpg',
    isHotBoN: true,
    title: '테스트 투표',
    voteCount: 1,
  },
  {
    id: 6,
    commentCount: 1,
    hasVoted: false,
    imageURL: '/assets/test_fashion_image.jpg',
    isHotBoN: true,
    title: '테스트 투표',
    voteCount: 1,
  },
  {
    id: 7,
    commentCount: 1,
    hasVoted: false,
    imageURL: '/assets/test_fashion_image.jpg',
    isHotBoN: false,
    title: '테스트 투표',
    voteCount: 1,
  },
];

export default function Page() {
  useHeader({ title: () => <VoteSubPageList /> });

  return (
    <>
      <FlexibleLayout.Root className="relative flex flex-col gap-3 bg-gray-50 p-5">
        <PostFilter />
        <BoNPostList />
      </FlexibleLayout.Root>

      <CreateBoNPostButton />
    </>
  );
}

function CreateBoNPostButton() {
  const { showModal } = useModalActions();

  const handleClick = () => {
    showModal({
      type: 'fullScreenDialog',
      animateType: 'slideUp',
      Component: UploadBoNModal,
    });
  };

  return (
    <div className="absolute bottom-20 right-5">
      <button type="button" className="block rounded-full bg-gray-900 p-4 shadow-bento" onClick={handleClick}>
        <MdEdit className="size-6 text-white" />
      </button>
    </div>
  );
}

const sortKeyValue: Record<string, string> = {
  recent: '최신순',
  popluar: '인기순',
};

const searchTypeKeyValue: Record<string, string> = {
  all: '전체',
  voted: '참여한 투표',
  'not-voted': '참여하지 않은 투표',
  mybon: '내가 올린 투표',
};

function PostFilter() {
  return (
    <div className="flex flex-row gap-4">
      <SelectBox items={sortKeyValue} defaultValue="recent" onValueChange={(value) => console.log(value)} />
      <SelectBox items={searchTypeKeyValue} defaultValue="all" onValueChange={(value) => console.log(value)} />
    </div>
  );
}

function BoNPostList() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {bonDatas.map((bonData) => (
          <BoNPostItem key={bonData.id} {...bonData} />
        ))}
      </div>

      <p className="text-sm text-gray-600">모든 Buy or Not 투표를 불러왔습니다.</p>
    </div>
  );
}

interface TBoNPostItem {
  id: number;
  title: string;
  imageURL: string;
  voteCount: number;
  commentCount: number;
  isHotBoN: boolean;

  hasVoted: boolean;
}

type BoNPostItemProps = TBoNPostItem;

function BoNPostItem({ id, commentCount, hasVoted, imageURL, isHotBoN, title, voteCount }: BoNPostItemProps) {
  const { showModal } = useModalActions();

  const handleClick = () => {
    showModal({
      type: 'fullScreenDialog',
      animateType: 'slideInFromRight',
      props: { bonId: id },
      Component: BoNDetailModal,
    });
  };

  return (
    <div
      role="button"
      className={cn('flex cursor-pointer flex-col gap-2 rounded-lg border border-gray-200 bg-white py-5', { ['border-red-400']: isHotBoN, ['opacity-55']: hasVoted })}
      onClick={handleClick}>
      <p className={cn('text-center font-semibold')}>
        {isHotBoN && '🔥 '}
        {title}
      </p>
      <div className="aspect-[4/3]">
        <Image src={imageURL} size="cover" />
      </div>
      <span className="ml-2 text-gray-400">
        투표 {voteCount}회 / 댓글 {commentCount}개
      </span>
    </div>
  );
}
