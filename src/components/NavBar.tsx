import { cn } from '@Utils/index';
import { useCallback } from 'react';
import { IconType } from 'react-icons/lib';
import { MdAccountBox, MdAdd, MdHowToVote, MdOutlineGridOn, MdPerson } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

interface NavItem {
  link: string;
  IconComponent: IconType;
}

const navList: NavItem[] = [
  {
    link: '/archive',
    IconComponent: MdOutlineGridOn,
  },
  {
    link: '/vote-fap',
    IconComponent: MdHowToVote,
  },
  {
    link: '/upload',
    IconComponent: MdAdd,
  },
  {
    link: '/feed',
    IconComponent: MdAccountBox,
  },
  {
    link: '/mypage',
    IconComponent: MdPerson,
  },
];

export function NavBar() {
  const memoizedCreateNavItem = useCallback((navItem: NavItem) => <NavItem key={navItem.link} {...navItem} />, []);

  return (
    <nav>
      <ul className="flex flex-row">{navList.map(memoizedCreateNavItem)}</ul>
    </nav>
  );
}

type NavItemProps = { link: string; IconComponent: IconType };

function NavItem({ link, IconComponent }: NavItemProps) {
  return (
    <li className="flex-1">
      <NavLink
        to={link}
        className={({ isActive }) =>
          cn('block h-full w-full py-5 transition-transform hover:rotate-3 hover:scale-125 active:scale-95', {
            ['text-purple-700']: isActive,
          })
        }>
        <IconComponent className="mx-auto size-6" />
      </NavLink>
    </li>
  );
}
