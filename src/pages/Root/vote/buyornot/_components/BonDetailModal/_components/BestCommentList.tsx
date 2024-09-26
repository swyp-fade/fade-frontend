import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { CommentItem } from '../_components/CommentItem';
import { bonQueries } from '../../../service';

export function BestCommentList({ bonId }: { bonId: number }) {
  const { data, isSuccess } = useSuspenseInfiniteQuery(
    bonQueries.comment({
      bonId,
      searchType: 'best',
    })
  );

  const hasNoBestComment = isSuccess && data.pages[0].data.comments.length === 0;

  if (hasNoBestComment) {
    return <></>;
  }

  return (
    <div className="bg-white py-5">
      <p className="pl-5 text-lg font-semibold">Best 댓글</p>

      <ul className="divide-y divide-gray-200">
        {data.pages.map((page) => page.data.comments.map((comment) => <CommentItem key={comment.id} bonId={bonId} {...comment} />))}
      </ul>
    </div>
  );
}
