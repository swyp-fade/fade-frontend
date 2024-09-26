import { useModalActions } from '@Hooks/modal';
import { useHeader } from '@Hooks/useHeader';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { queryClient } from '@Libs/queryclient';
import { Suspense, useState } from 'react';
import { MdEdit } from 'react-icons/md';
import { VoteSubPageList } from '../_components/VoteSubPageList';
import { BoNDetailModal } from './_components/BoNDetailModal';
import { bonQueryKeys } from './_components/BoNDetailModal.service';
import { BoNPostList } from './_components/BoNPostList';
import { PostFilter } from './_components/PostFilter';
import { UploadBoNModal } from './_components/UploadBoNModal';

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

function CreateBoNPostButton() {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    const bonId = await showModal({
      type: 'fullScreenDialog',
      animateType: 'slideUp',
      Component: UploadBoNModal,
    });

    if (typeof bonId === 'number') {
      showModal({
        type: 'fullScreenDialog',
        animateType: 'slideInFromRight',
        props: { bonId },
        Component: BoNDetailModal,
      });

      queryClient.invalidateQueries({
        queryKey: bonQueryKeys.all(),
        refetchType: 'all',
      });
    }
  };

  return (
    <div className="absolute bottom-20 right-5">
      <button type="button" className="block rounded-full bg-gray-900 p-4 shadow-bento" onClick={handleClick}>
        <MdEdit className="size-6 text-white" />
      </button>
    </div>
  );
}
