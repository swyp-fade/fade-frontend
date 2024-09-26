import { SelectBox } from './SelectBox';

const sortKeyValue: Record<string, string> = {
  recent: '최신순',
  popular: '인기순',
} as const;

const searchTypeKeyValue: Record<string, string> = {
  all: '전체',
  voted: '참여한 투표',
  not_voted: '참여하지 않은 투표',
  my_bon: '내가 올린 투표',
} as const;

interface TPostFilter {
  onSortChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
}

type PostFilterProps = TPostFilter;

export function PostFilter({ onSearchTypeChange, onSortChange }: PostFilterProps) {
  return (
    <div className="flex flex-row gap-4">
      <SelectBox items={sortKeyValue} defaultValue="recent" onValueChange={onSortChange} />
      <SelectBox items={searchTypeKeyValue} defaultValue="all" onValueChange={onSearchTypeChange} />
    </div>
  );
}
