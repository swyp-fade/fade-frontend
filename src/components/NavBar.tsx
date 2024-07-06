import { cn } from '@Utils/index';
import { IconType } from 'react-icons/lib';
import { MdAccountBox, MdAdd, MdHowToVote, MdOutlineGridOn, MdPerson } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

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
  const location = useLocation();
  const createNavItem = (navItem: NavItem) => <NavItem key={navItem.link} {...navItem} isActive={location.pathname.startsWith(navItem.link)} />;

  return (
    <nav>
      <ul className="flex flex-row">{navList.map(createNavItem)}</ul>
    </nav>
  );
}

type NavItemProps = { link: string; IconComponent: IconType; isActive: boolean };

function NavItem({ link, IconComponent, isActive }: NavItemProps) {
  const navigate = useNavigate();

  return (
    <li className="flex-1">
      <button
        type="button"
        className={cn('pointerdevice:hover:rotate-3 pointerdevice:hover:scale-125 pointerdevice:active:scale-95 block h-full w-full py-5 transition-transform', {
          ['text-purple-700']: isActive,
        })}
        onClick={() => navigate(link)}>
        <IconComponent className="mx-auto size-6" />
      </button>
    </li>
  );
}
