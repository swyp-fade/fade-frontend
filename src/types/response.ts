export type InfiniteResponse<T> = {
  nextCursor: number;
} & T;
