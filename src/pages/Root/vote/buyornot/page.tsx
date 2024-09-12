import { useHeader } from '@Hooks/useHeader';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { VoteSubPageList } from '../_components/VoteSubPageList';

export default function Page() {
  useHeader({
    title: () => <VoteSubPageList />,
  });

  return <FlexibleLayout.Root className="gap-3 p-5">buy or not 화면입니다</FlexibleLayout.Root>;
}
