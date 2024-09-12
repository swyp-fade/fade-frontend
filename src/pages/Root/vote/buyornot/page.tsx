import { useHeader } from '@Hooks/useHeader';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';

export default function Page() {
  useHeader({
    title: 'Buy or Not',
  });

  return <FlexibleLayout.Root className="gap-3 p-5">buy or not 화면입니다</FlexibleLayout.Root>;
}
