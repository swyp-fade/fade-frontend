import { Button } from '@Components/ui/button';
import { Image } from '@Components/ui/image';
import { useModalActions } from '@Hooks/modal';
import { useInfiniteObserver } from '@Hooks/useInfiniteObserver';
import { requestGetAllFashionFeed } from '@Services/feed';
import { useInfiniteQuery } from '@tanstack/react-query';
import { cn } from '@Utils/index';
import { useEffect, useState } from 'react';
import { VscLoading } from 'react-icons/vsc';
import { FilterType, SelectFilterDialog, SelectFilterDialogProps } from './SelectFilterDialog';

export function AllArchivingView() {
  const [filters, setFilters] = useState<FilterType>({
    gender: null,
    selectedStyles: [],
  });

  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['archiving', 'all', { ...filters }],
    queryFn: ({ pageParam }) => requestGetAllFashionFeed({ nextCursor: pageParam, filters }),
    getNextPageParam(lastPage) {
      return lastPage.nextCursor !== null ? lastPage.nextCursor : undefined;
    },
    initialPageParam: 0,
  });

  const { disconnect: disconnectObserver } = useInfiniteObserver({
    parentNodeId: 'feedList',
    onIntersection: fetchNextPage,
  });

  useEffect(() => {
    !hasNextPage && disconnectObserver();
  }, [hasNextPage]);

  const handleFilterChanged = (newFilter: FilterType) => {
    setFilters(newFilter);
  };

  return (
    <div className="w-full p-1">
      {/* TODO: 나중에 스크롤 애니메이션 달아보기 */}
      <div className="w-full bg-white p-5">
        <SelectFilterButton filters={filters} onFilterChanged={handleFilterChanged} />
      </div>

      <div className="flex h-full min-h-1 flex-col overflow-y-scroll">
        <div id="feedList" className="grid w-full grid-cols-3 gap-1">
          {data?.pages.map(({ feeds }) =>
            feeds.map((feed) => (
              <div key={`item-${feed.feedId}`} className="group aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-lg">
                <Image src={feed.imageURL} className="h-full w-full transition-transform group-hover:scale-105" />
              </div>
            ))
          )}
        </div>

        {(isFetchingNextPage || isPending) && (
          <div className="flex w-full items-center justify-center p-5">
            <VscLoading className="size-6 animate-spin" />
          </div>
        )}

        {!isPending && !hasNextPage && <p className="text-detail text-gray-700">모든 페이더들의 패션을 불러왔어요.</p>}
      </div>
    </div>
  );
}

interface TSelectFilterButton {
  filters: FilterType;
  onFilterChanged: (newFilters: FilterType) => void;
}

type SelectFilterButtonProps = TSelectFilterButton;

function SelectFilterButton({ filters, onFilterChanged }: SelectFilterButtonProps) {
  const { showModal } = useModalActions();

  const hasFilters = filters.gender !== null || filters.selectedStyles.length !== 0;

  const handleClick = async () => {
    const selectFilterResult = await showModal<FilterType>({
      type: 'fullScreenDialog',
      animateType: 'slideInFromRight',
      Component: SelectFilterDialog,
      props: { defaultFilter: filters } as SelectFilterDialogProps,
    });

    selectFilterResult && onFilterChanged(selectFilterResult);
  };

  return (
    <Button
      variants="secondary"
      className={cn('w-full bg-gray-100 text-gray-900', {
        ['bg-purple-50']: hasFilters,
      })}
      onClick={handleClick}>
      {hasFilters && '필터 적용중'}
      {!hasFilters && '필터'}
    </Button>
  );
}
