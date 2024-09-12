import { Button } from '@Components/ui/button';
import { useHeaderStore } from '@Stores/header';
import { cn } from '@Utils/index';
import { PropsWithChildren, useLayoutEffect } from 'react';
import { MdCheck, MdChevronRight } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

const VoteTitleNameMap: Record<string, string> = {
  '/vote/fap': 'FA:P 투표',
  '/vote/buyornot': 'Buy or Not',
};

const getCurrentTitleByPathname = (pathname: string) => VoteTitleNameMap[pathname] || '';

export function VoteSubPageList() {
  const { pathname } = useLocation();
  const currentTitle = getCurrentTitleByPathname(pathname);
  const setSubSlot = useHeaderStore((state) => state.setSubSlot);
  const isSubSlotVisible = useHeaderStore((state) => state.isSubSlotVisible);
  const setIsSubSlotVisible = useHeaderStore((state) => state.setIsSubSlotVisible);

  useLayoutEffect(() => {
    setSubSlot(() => <SubList />);
  }, []);

  return (
    <>
      <Button variants="ghost" interactive="onlyScale" onClick={() => setIsSubSlotVisible(!isSubSlotVisible)}>
        {currentTitle}
        <MdChevronRight
          className={cn('rotate-90 transition-transform', {
            ['-rotate-90']: isSubSlotVisible,
          })}
        />
      </Button>
    </>
  );
}

function SubList() {
  const { pathname } = useLocation();

  return (
    <ul className="space-y-4 rounded-b-lg bg-white p-5 pb-10">
      {Object.entries(VoteTitleNameMap).map(([path, name]) => (
        <SubListItem key={path} href={path} active={path === pathname}>
          {name}
        </SubListItem>
      ))}
    </ul>
  );
}

interface TSubListItem {
  href: string;
  active?: boolean;
}

type SubListItemProps = PropsWithChildren<TSubListItem>;

function SubListItem({ href, active, children }: SubListItemProps) {
  const setIsSubSlotVisible = useHeaderStore((state) => state.setIsSubSlotVisible);

  return (
    <li>
      <Link
        className={cn('flex flex-row items-center justify-between rounded-lg border p-4', {
          ['border border-purple-200 bg-purple-50']: active,
        })}
        to={href}
        onClick={() => setIsSubSlotVisible(false)}>
        {children}

        {active && <MdCheck className="text-purple-400" />}
      </Link>
    </li>
  );
}
