import { BackButton } from '@Components/ui/button';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { useSuspenseQuery } from '@tanstack/react-query';
import { TBoNDetail } from '@Types/model';
import { ReactNode, Suspense } from 'react';
import { BoNContent } from './_components/BoNContent';
import { CommentBox } from './_components/CommentBox';
import { bonQueries } from './service';
import { BestCommentList } from './_components/BestCommentList';
import { AllCommentList } from './_components/AllCommentList';

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
          <span className="mx-auto text-h5 font-semibold">투표 상세</span>
        </header>
      </FlexibleLayout.Header>

      <Suspense fallback={<>로딩중 ...</>}>
        <BoNDetailProvider bonId={bonId}>
          {(bonDetail) => (
            <>
              <FlexibleLayout.Content className="space-y-2 bg-gray-100">
                <BoNContent bonId={bonId} bonDetail={bonDetail} onDelete={onClose} />
                <BestCommentList bonId={bonId} />
                <AllCommentList bonId={bonId} />
              </FlexibleLayout.Content>

              {!bonDetail.isMine && (
                <FlexibleLayout.Footer>
                  <CommentBox bonId={bonId} bonDetail={bonDetail} />
                </FlexibleLayout.Footer>
              )}
            </>
          )}
        </BoNDetailProvider>
      </Suspense>
    </FlexibleLayout.Root>
  );
}

type FuncitonChildren = (bonDetail: TBoNDetail) => ReactNode;

interface TBoNDetailProvider {
  bonId: number;
  children: FuncitonChildren;
}

type BoNDetailProviderProps = TBoNDetailProvider;

function BoNDetailProvider({ bonId, children }: BoNDetailProviderProps) {
  if (typeof children !== 'function') {
    throw new Error('BoNDetailProvider 컴포넌트의 children은 함수여야 합니다.');
  }

  const {
    data: { data: bonDetail },
  } = useSuspenseQuery(bonQueries.detail({ bonId }));

  return children(bonDetail);
}
