import { cn } from '@Utils/index';
import { HTMLAttributes, PropsWithChildren } from 'react';

function Root({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <div className={cn('flex h-full flex-col', className)} {...props}>
      {children}
    </div>
  );
}

function Header({ children }: PropsWithChildren) {
  return <>{children}</>;
}

function Content({ children, className, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  return (
    <section className={cn('min-h-1 flex-1 overflow-y-scroll border border-blue-300 p-5', className)} {...props}>
      {children}
    </section>
  );
}

function Footer({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export const FlexibleLayout = { Root, Header, Content, Footer };
