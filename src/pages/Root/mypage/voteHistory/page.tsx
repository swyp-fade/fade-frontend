import fadeInImage from '@Assets/vote_fade_in.png';
import { FeedDetailDialog } from '@Components/FeedDetailDialog';
import { Grid } from '@Components/ui/grid';
import { Image } from '@Components/ui/image';
import { useModalActions } from '@Hooks/modal';
import { useHeader } from '@Hooks/useHeader';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { requestGetVoteHistory } from '@Services/vote';
import { useInfiniteQuery } from '@tanstack/react-query';
import { TVoteHistoryItem } from '@Types/model';
import { cn } from '@Utils/index';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { MdChevronLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import './dateStyle.css';

export default function Page() {
  useHeader({ title: '투표 내역', leftSlot: () => <BackButton /> });

  const [isFadeInMode, setIsFadeInMode] = useState(false);
  const [scrollType, setScrollType] = useState('0');

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['user', 0, 'voteHistory', scrollType],
    queryFn: ({ pageParam }) =>
      requestGetVoteHistory({
        nextCursor: scrollType === '0' ? pageParam.nextCursorToUpScroll : scrollType === '1' ? pageParam.nextCursorToDownScroll : format(new Date(), 'yyyy-MM-dd'),
        scrollType,
      }),
    getNextPageParam(lastPage) {
      if (lastPage.isLastCursorToDownScroll) {
        return undefined;
      }

      if (lastPage.isLastCursorToUpScroll) {
        return undefined;
      }

      return { nextCursorToUpScroll: lastPage.nextCursorToUpScroll, nextCursorToDownScroll: lastPage.nextCursorToDownScroll };
    },
    initialPageParam: { nextCursorToUpScroll: format(new Date(), 'yyyy-MM-dd'), nextCursorToDownScroll: format(new Date(), 'yyyy-MM-dd') },
  });

  const { disconnect: disconnectObserver } = useInfiniteObserver({
    parentNodeId: 'feedList',
    onIntersection: fetchNextPage,
  });

  useEffect(() => {
    !hasNextPage && disconnectObserver();
  }, [hasNextPage]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-row items-center gap-3 border border-red-500 bg-white px-5 py-3">
        <input
          id="datePicker"
          type="date"
          className="relative flex-1 appearance-none rounded-lg border-none bg-gray-100 bg-none px-3 py-1 outline-none"
          defaultValue={format(new Date(), 'yyyy-MM-dd')}
        />
        <FadeInModeToggleButton isFadeInMode={isFadeInMode} onToggle={() => setIsFadeInMode((prev) => !prev)} />
      </div>

      <div className="flex-1 space-y-[3.75rem] overflow-y-scroll p-5">
        {data?.pages.map((page) =>
          [page.feeds.slice(0, 10), page.feeds.slice(11, 21), page.feeds.slice(21, 31)].map((feeds) => <VoteHistoryItem isFadeInMode={isFadeInMode} feeds={feeds} />)
        )}
        <p className="text-detail text-gray-700">모든 투표 내역을 불러왔습니다.</p>
      </div>
    </div>
  );
}

function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      className="group cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100"
      onClick={() => navigate('/mypage', { replace: true })}>
      <MdChevronLeft className="size-6 transition-transform group-active:scale-95" />
    </button>
  );
}

function FadeInModeToggleButton({ isFadeInMode, onToggle }: { isFadeInMode: boolean; onToggle: () => void }) {
  return (
    <button
      className={cn('rounded-3xl bg-gray-200 p-1 shadow-inner transition-colors', {
        ['pr-8']: !isFadeInMode,
        ['bg-purple-500 pl-8']: isFadeInMode,
      })}
      onClick={() => onToggle()}>
      <motion.div layout className="rounded-3xl bg-white px-3 py-2">
        <Image src={fadeInImage} className="h-[.75rem] w-[3.875rem]" />
      </motion.div>
    </button>
  );
}

function VoteHistoryItem({ isFadeInMode, feeds }: { isFadeInMode: boolean; feeds: TVoteHistoryItem[] }) {
  const votedAtLabel = feeds.at(0) && format(feeds.at(0).votedAt, 'yyyy년 M월 d일');

  return (
    <section className="space-y-2">
      <h6 className="text-h6 font-semibold">{votedAtLabel}</h6>
      <Grid id="feedList" cols={5}>
        <AnimatePresence>
          {feeds.map((feed, index) => {
            if (isFadeInMode) {
              return feed.voteType === 'FADE_IN' && <FeedItem key={`feed-item-${feed.feedId}`} {...feed} feeds={feeds} index={index} />;
            } else {
              return <FeedItem key={`feed-item-${feed.feedId}`} {...feed} feeds={feeds} index={index} />;
            }
          })}
        </AnimatePresence>
      </Grid>
    </section>
  );
}
interface TFeedItem {
  feeds: TVoteHistoryItem[];
  index: number;
}

type FeedItemProps = TFeedItem & TVoteHistoryItem;

function FeedItem({ feeds, index, ...feed }: FeedItemProps) {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    await showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: FeedDetailDialog, props: { feeds, defaultViewIndex: index } });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="group aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-lg"
      onClick={handleClick}>
      <Image src={feed.feedImageURL} className="h-full w-full transition-transform group-hover:scale-105" />
    </motion.div>
  );
}
