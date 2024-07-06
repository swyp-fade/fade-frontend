import { useHeaderStore } from '@Stores/header';
import { ReactNode, useEffect } from 'react';

type UseHeaderProps = { title?: string; leftSlot?: () => ReactNode; rightSlot?: () => ReactNode };

export function useHeader({ title, leftSlot, rightSlot }: UseHeaderProps) {
  const setTitle = useHeaderStore((state) => state.setTitle);
  const setLeftSlot = useHeaderStore((state) => state.setLeftSlot);
  const setRightSlot = useHeaderStore((state) => state.setRightSlot);

  useEffect(() => {
    setTitle(title);
    setLeftSlot(leftSlot);
    setRightSlot(rightSlot);
  }, []);
}
