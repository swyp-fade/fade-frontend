import testImage from '@Assets/test_fashion_image.jpg';
import { FeedDetailCard } from '@Components/FeedDetailCard';
import { ShowNotificationButton } from '@Components/ShowNotificationButton';
import { Avatar } from '@Components/ui/avatar';
import { useHeader } from '@Hooks/useHeader';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { requestGetSubscribeFeeds } from '@Services/feed';
import { useInfiniteQuery } from '@tanstack/react-query';
import { cn } from '@Utils/index';
import { useEffect } from 'react';
import { MdChevronRight } from 'react-icons/md';
import { VscLoading } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';

type SubscribeBadgeType = {
  userId: number;
  profileURL: string;
  accountId: string;
};

const subscribeList: SubscribeBadgeType[] = [
  {
    userId: 0,
    profileURL: testImage,
    accountId: 'testaccount',
  },
  {
    userId: 1,
    profileURL: testImage,
    accountId: 'testaccount',
  },
  {
    userId: 2,
    profileURL: testImage,
    accountId: 'testaccount',
  },
  {
    userId: 3,
    profileURL: testImage,
    accountId: 'testaccount',
  },
  {
    userId: 4,
    profileURL: testImage,
    accountId: 'testaccount',
  },
];

export default function Page() {
  const { data, fetchNextPage, isFetchingNextPage, isPending, hasNextPage } = useInfiniteQuery({
    queryKey: ['subscribe', 'list'],
    queryFn: ({ pageParam }) => requestGetSubscribeFeeds({ nextCursor: pageParam }),
    getNextPageParam({ nextCursor }) {
      return nextCursor || undefined;
    },
    initialPageParam: 0,
  });

  useHeader({
    title: '구독',
    leftSlot: () => (isFetchingNextPage || isPending) && <VscLoading className="size-6 animate-spin" />,
    rightSlot: () => <ShowNotificationButton />,
  });

  const { disconnect: disconnectObserver } = useInfiniteObserver({
    parentNodeId: 'feedList',
    onIntersection: fetchNextPage,
  });

  useEffect(() => {
    !hasNextPage && disconnectObserver();
  }, [hasNextPage]);

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative h-fit w-full px-5 py-4">
        <div className="overflow-y-scroll">
          <ul className="flex flex-row gap-3">
            {subscribeList.map((subscribe) => (
              <li
                key={`subscribe-${subscribe.userId}`}
                className={cn('boder-gray-200 flex h-full flex-row items-center gap-2 rounded-lg border p-2', {
                  ['border-purple-100 bg-purple-50']: subscribe.userId === 0,
                })}>
                <Avatar src={subscribe.profileURL} size="32" />
                <span>{subscribe.accountId}</span>
              </li>
            ))}
          </ul>
        </div>

        <ShowSubscribeListViewButton />
      </div>

      <div className="relative min-h-1 flex-1 snap-y snap-mandatory overflow-y-scroll">
        <div id="feedList" className="h-full">
          {data && data.pages.map((page) => page.feeds.map((feedDetail) => <FeedDetailCard key={feedDetail.feedId} {...feedDetail} />))}
        </div>

        {!isPending && !hasNextPage && <p className="text-detail text-gray-700">모든 페이더들의 패션을 불러왔어요.</p>}
      </div>
    </div>
  );
}

function ShowSubscribeListViewButton() {
  const navigate = useNavigate();

  return (
    <button className="absolute right-5 top-1/2 -translate-y-1/2 bg-fade-gradient px-2 py-4" onClick={() => navigate('/subscribe/list')}>
      <MdChevronRight className="size-6" />
    </button>
  );
}
