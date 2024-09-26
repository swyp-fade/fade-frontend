import { queryClient } from '@Libs/queryclient';
import {
  requestAddBoNComment,
  requestDeleteBoN,
  requestDeleteBoNComment,
  requestGetBoNComment,
  requestGetBoNDetail,
  requestGetBoNList,
  requestLikeBoNComment,
  requestVoteBoN,
} from '@Services/bon';
import { InfiniteData, infiniteQueryOptions, queryOptions, useMutation } from '@tanstack/react-query';
import { BoNVotedValue, TBoNComment, TBoNDetail } from '@Types/model';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { produce, WritableDraft } from 'immer';

export const bonQueryKeys = {
  all: () => ['bon'],
  list: ({ searchType, sortType }: { searchType: string; sortType: string }) => [...bonQueryKeys.all(), { searchType, sortType }],
  detail: ({ bonId }: { bonId: number }) => [...bonQueryKeys.all(), 'detail', bonId],
  details: () => [...bonQueryKeys.all(), 'detail'],
  comment: ({ bonId, searchType }: { bonId: number; searchType: 'all' | 'best' }) => [...bonQueryKeys.detail({ bonId }), 'comment', { searchType }],
  comments: ({ bonId }: { bonId: number }) => [...bonQueryKeys.detail({ bonId }), 'comment'],
};

export const bonQueries = {
  list: ({ searchType, sortType }: { searchType: string; sortType: string }) =>
    infiniteQueryOptions({
      queryKey: bonQueryKeys.list({ searchType, sortType }),
      queryFn: ({ pageParam }) => requestGetBoNList({ nextCursor: pageParam, limit: 10, searchType, sortType }),
      initialPageParam: -1,
      getNextPageParam: ({ data: { nextCursor } }) => (nextCursor !== null ? nextCursor : undefined),
    }),
  detail: ({ bonId }: { bonId: number }) =>
    queryOptions({
      queryKey: bonQueryKeys.detail({ bonId }),
      queryFn: () => requestGetBoNDetail({ bonId }),
    }),
  comment: ({ bonId, searchType }: { bonId: number; searchType: 'all' | 'best' }) =>
    infiniteQueryOptions({
      queryKey: bonQueryKeys.comment({ bonId, searchType }),
      queryFn: ({ pageParam }) => requestGetBoNComment({ bonId, nextCursor: pageParam, limit: 5, searchType }),
      initialPageParam: -1,
      getNextPageParam: ({ data: { nextCursor } }) => (nextCursor !== null ? nextCursor : undefined),
    }),
};

export const useDeleteBoN = () =>
  useMutation({
    mutationKey: ['deleteBoN'],
    mutationFn: requestDeleteBoN,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: bonQueryKeys.all(), refetchType: 'all' });
    },
  });

export const useAddBoNComment = ({ votedValue }: { votedValue: BoNVotedValue }) =>
  useMutation({
    mutationKey: ['addBoNComment'],
    mutationFn: requestAddBoNComment,
    onMutate({ bonId, contents }) {
      const newBoNComment = createTempBoNComment({ contents, votedValue });

      updateBoNCommentOptimistically({ bonId, newBoNComment });
      updateBoNDetailCommentOptimistically({ bonId });
    },
    onSuccess(_, { bonId }) {
      queryClient.invalidateQueries({
        queryKey: bonQueryKeys.comment({ bonId, searchType: 'all' }),
        refetchType: 'all',
      });
    },
  });

export const useVoteBoN = ({ hasVoted, currentVotedValue }: { hasVoted: boolean; currentVotedValue: BoNVotedValue }) =>
  useMutation({
    mutationKey: ['voteBoN'],
    mutationFn: requestVoteBoN,
    onMutate({ bonId, votedValue }) {
      updateBoNDetailCountOptimistically({ bonId, currentVotedValue, hasVoted, votedValue });
    },
  });

type CommentResponseType = InfiniteData<AxiosResponse<{ comments: TBoNComment[] }>>;

export const useLikeBoNComment = () =>
  useMutation({
    mutationKey: ['likeBoNComment'],
    mutationFn: requestLikeBoNComment,
    async onMutate({ bonId, commentId, doesLike }) {
      const commentQueryKey = bonQueryKeys.comment({ bonId, searchType: 'all' });
      const bestCommentQueryKey = bonQueryKeys.comment({ bonId, searchType: 'best' });

      await queryClient.cancelQueries({ queryKey: commentQueryKey });
      await queryClient.cancelQueries({ queryKey: bestCommentQueryKey });

      updateCommentLikeOptimistically({ bonId, commentId, doesLike, searchType: 'all' });
      updateCommentLikeOptimistically({ bonId, commentId, doesLike, searchType: 'best' });
    },
  });

export const useDeleteBoNComment = () =>
  useMutation({
    mutationKey: ['deleteBoNComment'],
    mutationFn: requestDeleteBoNComment,
    async onMutate({ bonId, commentId }) {
      const commentQueryKey = bonQueryKeys.comment({ bonId, searchType: 'all' });
      const bestCommentQueryKey = bonQueryKeys.comment({ bonId, searchType: 'best' });

      await queryClient.cancelQueries({ queryKey: commentQueryKey });
      await queryClient.cancelQueries({ queryKey: bestCommentQueryKey });

      removeCommentOptimistically({ bonId, commentId, searchType: 'all' });
      removeCommentOptimistically({ bonId, commentId, searchType: 'best' });
      removeCommentCountOptimistically({ bonId });
    },
    onSuccess(_, { bonId }) {
      queryClient.invalidateQueries({ queryKey: bonQueryKeys.comments({ bonId }), refetchType: 'all' });
    },
  });

/** BoN 본문 댓글수 Optimistic Update */
function removeCommentCountOptimistically({ bonId }: { bonId: number }) {
  queryClient.setQueryData<AxiosResponse<TBoNDetail>>(bonQueryKeys.detail({ bonId }), (oldDetail) =>
    produce(oldDetail, (draft) => {
      draft!.data.commentCount--;
      draft!.data.hasCommented = false;
    })
  );
}

/** BoN 댓글 삭제 Optimistic Update */
function removeCommentOptimistically({ bonId, searchType, commentId }: { bonId: number; searchType: 'all' | 'best'; commentId: number }) {
  queryClient.setQueryData<CommentResponseType>(bonQueryKeys.comment({ bonId, searchType }), (oldComments) =>
    produce(oldComments, (draft) => {
      const pageIndex = draft!.pages.findIndex((page) => page.data.comments.some(({ id: targetId }) => targetId === commentId));

      if (pageIndex !== -1) {
        const commentIndex = draft!.pages[pageIndex].data.comments.findIndex(({ id: targetId }) => targetId === commentId);

        if (commentIndex !== -1) {
          draft!.pages[pageIndex].data.comments.splice(commentIndex, 1);
        }
      }
    })
  );
}
/** BoN 본문 댓글 좋아요 Optimistic Update */
function updateCommentLikeOptimistically({
  bonId,
  commentId,
  doesLike,
  searchType,
}: {
  bonId: number;
  commentId: number;
  searchType: 'all' | 'best';
  doesLike: boolean;
}) {
  queryClient.setQueryData<CommentResponseType>(bonQueryKeys.comment({ bonId, searchType }), (oldComments) =>
    produce(oldComments, (draft) => {
      const pageIndex = draft!.pages.findIndex((page) => page.data.comments.some(({ id: targetId }) => targetId === commentId));

      if (pageIndex !== -1) {
        const commentIndex = draft!.pages[pageIndex].data.comments.findIndex(({ id: targetId }) => targetId === commentId);

        if (commentIndex !== -1) {
          draft!.pages[pageIndex].data.comments[commentIndex].hasLiked = doesLike;
          draft!.pages[pageIndex].data.comments[commentIndex].likeCount = doesLike
            ? draft!.pages[pageIndex].data.comments[commentIndex].likeCount + 1
            : draft!.pages[pageIndex].data.comments[commentIndex].likeCount - 1;
        }
      }
    })
  );
}

function createTempBoNComment({ contents, votedValue }: { contents: string; votedValue: BoNVotedValue }) {
  return {
    anonName: '-',
    contents,
    createdAt: new Date(),
    hasLiked: false,
    id: Math.floor(Math.random() * 1000000),
    isBestComment: false,
    isMine: true,
    likeCount: 0,
    votedValue,
  };
}

/** 댓글 Optimistic Update */
function updateBoNCommentOptimistically({ bonId, newBoNComment }: { bonId: number; newBoNComment: TBoNComment }) {
  queryClient.setQueryData<InfiniteData<AxiosResponse<{ comments: TBoNComment[] }>>>(bonQueryKeys.comment({ bonId, searchType: 'all' }), (oldComments) =>
    produce(oldComments, (draft) => {
      if (draft) {
        draft.pages.unshift({
          data: { comments: [newBoNComment] },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {} as WritableDraft<InternalAxiosRequestConfig<unknown>>,
        });
      }
    })
  );
}

/** 본문 댓글 수 Optimistic Update */
function updateBoNDetailCommentOptimistically({ bonId }: { bonId: number }) {
  queryClient.setQueryData<AxiosResponse<TBoNDetail>>(bonQueryKeys.detail({ bonId }), (oldDetail) =>
    produce(oldDetail, (draft) => {
      if (draft?.data) {
        draft.data.commentCount += 1;
        draft.data.hasCommented = true;
      }
    })
  );
}

/** 본문 투표 수 Optimistic Update */
function updateBoNDetailCountOptimistically({
  bonId,
  votedValue,
  hasVoted,
  currentVotedValue,
}: {
  bonId: number;
  votedValue: BoNVotedValue;
  hasVoted: boolean;
  currentVotedValue: BoNVotedValue;
}) {
  queryClient.setQueryData<AxiosResponse<TBoNDetail>>(bonQueryKeys.detail({ bonId }), (oldDetail) =>
    produce(oldDetail, (draft) => {
      if (draft === undefined) {
        return;
      }

      draft.data.myVotedValue = votedValue;

      draft.data.voteCount = (() => {
        // 투표 처음 할 때
        if (!hasVoted) {
          return draft.data.voteCount + 1;
        }

        // 투표 취소
        if (votedValue === 'NOT') {
          return draft.data.voteCount - 1;
        }

        // 이전과 다른 투표
        return draft.data.voteCount;
      })();

      draft.data.bonCount = (() => {
        // 투표 처음 할 때
        if (!hasVoted) {
          return {
            yes: votedValue === 'YES' ? draft.data.bonCount.yes + 1 : draft.data.bonCount.yes,
            no: votedValue === 'NO' ? draft.data.bonCount.no + 1 : draft.data.bonCount.no,
          };
        }

        // 투표 취소
        if (votedValue === 'NOT') {
          return {
            yes: currentVotedValue === 'YES' ? draft.data.bonCount.yes - 1 : draft.data.bonCount.yes,
            no: currentVotedValue === 'NO' ? draft.data.bonCount.no - 1 : draft.data.bonCount.no,
          };
        }

        // 다른 거 투표 (YES -> NO)
        if (votedValue === 'NO') {
          return {
            yes: draft.data.bonCount.yes - 1,
            no: draft.data.bonCount.no + 1,
          };
        }

        // 다른 거 투표 (NO -> YES)
        return {
          yes: draft.data.bonCount.yes + 1,
          no: draft.data.bonCount.no - 1,
        };
      })();
    })
  );
}
