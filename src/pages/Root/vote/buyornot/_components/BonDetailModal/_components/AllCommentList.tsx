import { SpinLoading } from '@Components/SpinLoading';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { cn } from '@Utils/index';
import { CommentItem } from '../_components/CommentItem';
import { bonQueries } from '../service';

export function AllCommentList({ bonId }: { bonId: number }) {
  const { data, fetchNextPage, isFetching, isSuccess } = useSuspenseInfiniteQuery(bonQueries.comment({ bonId, searchType: 'all' }));

  useInfiniteObserver({
    parentNodeId: 'defaultCommentList',
    onIntersection: fetchNextPage,
  });

  const hasNoComments = isSuccess && data.pages[0].data.comments.length === 0;

  return (
    <div
      className={cn('bg-white py-5', {
        ['aspect-[2/1] w-full']: hasNoComments,
      })}>
      <p className="pl-5 text-lg font-semibold">전체 댓글</p>

      <ul id="defaultCommentList" className="divide-y divide-gray-200">
        {data.pages.map((page) => page.data.comments.map((comment) => <CommentItem key={comment.id} bonId={bonId} {...comment} />))}
      </ul>

      {hasNoComments && (
        <div className="flex h-full w-full items-center justify-center">
          <p className="text-grey-500">아직 댓글이 없어요.</p>
        </div>
      )}

      {isFetching && <SpinLoading />}
    </div>
  );
}
