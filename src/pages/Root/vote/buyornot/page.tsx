import { useHeader } from '@Hooks/useHeader';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { Suspense, useState } from 'react';
import { VoteSubPageList } from '../_components/VoteSubPageList';
import { BoNPostList } from './_components/BoNPostList';
import { PostFilter } from './_components/PostFilter';
import { CreateBoNPostButton } from './_components/CreateBoNPostButton';

export default function Page() {
  useHeader({ title: () => <VoteSubPageList /> });

  const [sortType, setSortType] = useState('recent');
  const [searchType, setSearchType] = useState('all');

  return (
    <>
      <FlexibleLayout.Root className="relative flex flex-col gap-3 bg-gray-50 p-5">
        <PostFilter onSortChange={(value) => setSortType(value)} onSearchTypeChange={(value) => setSearchType(value)} />
        <Suspense fallback={<BoNPostListSkeleton />}>
          <BoNPostList sortType={sortType} searchType={searchType} />
        </Suspense>
      </FlexibleLayout.Root>

      <CreateBoNPostButton />
    </>
  );
}

function BoNPostListSkeleton() {
  return (
    <div id="bonList" className="grid grid-cols-2 gap-4">
      <div className="aspect-square w-full animate-pulse rounded-sm bg-gray-200" />
      <div className="aspect-square w-full animate-pulse rounded-sm bg-gray-200" />
      <div className="aspect-square w-full animate-pulse rounded-sm bg-gray-200" />
      <div className="aspect-square w-full animate-pulse rounded-sm bg-gray-200" />
    </div>
  );
}
