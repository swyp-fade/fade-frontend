import { cn } from '@Utils/index';
import { PropsWithChildren } from 'react';

interface GridProps {
  cols: 3 | 5;
}

export function Grid({ cols, children }: PropsWithChildren<GridProps>) {
  return (
    <div
      className={cn('grid w-full', {
        ['grid-cols-3 gap-1']: cols === 3,
        ['grid-cols-5 gap-2']: cols === 5,
      })}>
      {children}
    </div>
  );
}
