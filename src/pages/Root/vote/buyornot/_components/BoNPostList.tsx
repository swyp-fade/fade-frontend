import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { bonQueries } from './BoNDetailModal.service';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { SpinLoading } from '@Components/SpinLoading';
import { TBoNItem } from '@Types/model';
import { useModalActions } from '@Hooks/modal';
import { BoNDetailModal } from './BoNDetailModal';
import { MdWhatshot } from 'react-icons/md';
import { cn } from '@Utils/index';
import { Image } from '@Components/ui/image';

interface TBoNPostList {
  sortType: string;
  searchType: string;
}

type BoNPostListProps = TBoNPostList;

export function BoNPostList({ searchType, sortType }: BoNPostListProps) {
  const { data, fetchNextPage, isFetching, isSuccess } = useSuspenseInfiniteQuery(bonQueries.list({ searchType, sortType }));

  const hasNoPost = isSuccess && data.pages[0].data.bonList.length === 0;

  useInfiniteObserver({
    parentNodeId: 'bonList',
    onIntersection: fetchNextPage,
  });

  return (
    <div className="space-y-4">
      <div id="bonList" className="grid grid-cols-2 gap-4">
        {data.pages.map((page) => page.data.bonList.map((bonItem) => <BoNPostItem key={bonItem.id} {...bonItem} />))}
      </div>
      {isFetching && <SpinLoading />}
      {hasNoPost && <p className="text-sm text-gray-600">표시할 Buy or Not 투표가 없습니다.</p>}
    </div>
  );
}

type BoNPostItemProps = TBoNItem;

export function BoNPostItem({ id, commentCount, hasVoted, imageURL, isHot, title, voteCount }: BoNPostItemProps) {
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
      className={cn('flex cursor-pointer flex-col gap-2 rounded-lg border border-gray-200 bg-white py-5', {
        ['border-red-400']: isHot,
        ['opacity-55']: hasVoted,
      })}
      onClick={handleClick}>
      <div className="flex flex-row items-center justify-center gap-1">
        {isHot && <MdWhatshot className="inline-block text-[#EC228B]" />}
        <span className="text-center font-semibold">{title}</span>
      </div>

      <div className="aspect-[4/3]">
        <Image src={imageURL} size="cover" />
      </div>

      <span className="ml-2 text-gray-400">
        투표 {voteCount}회 ・ 댓글 {commentCount}개
      </span>
    </div>
  );
}
