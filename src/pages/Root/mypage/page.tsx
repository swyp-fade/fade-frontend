import testImage from '@Assets/test_fashion_image.jpg';
import { useConfirm, useModalActions } from '@Hooks/modal';
import { useHeader } from '@Hooks/useHeader';
import { IconType } from 'react-icons/lib';
import { MdBook, MdBookmark, MdHowToVote, MdOutlineNotificationsNone, MdPerson } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AccountSetting from './components/AccountSetting';

type MyPageMenu = {
  id: number;
  type: 'subpage' | 'dialog';
  path: string | null;
  IconComponent: IconType;
  name: string;
};

const mypageMenus: MyPageMenu[] = [
  {
    id: 0,
    type: 'subpage',
    path: '/mypage/feed',
    IconComponent: MdPerson,
    name: '내 피드',
  },
  {
    id: 1,
    type: 'subpage',
    path: '/mypage/vote-history',
    IconComponent: MdHowToVote,
    name: '투표 내역',
  },
  {
    id: 2,
    type: 'subpage',
    path: '/mypage/bookmark',
    IconComponent: MdBookmark,
    name: '북마크',
  },
  {
    id: 3,
    type: 'dialog',
    path: null,
    IconComponent: MdBook,
    name: '서비스 정책',
  },
];

export default function Page() {
  useHeader({ title: '마이페이지', rightSlot: () => <ShowNotificationButton /> });

  const handleMenuClick = ({ path, type }: MyPageMenu) => {
    console.log({ path, type });
  };

  return (
    <div className="flex h-full flex-col bg-gray-100">
      <div className="flex flex-col items-center justify-center gap-5 rounded-b-2xl bg-white pb-5 pt-10">
        <div style={{ backgroundImage: `url('${testImage}')` }} className="size-32 rounded-lg bg-cover bg-center bg-no-repeat" />

        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-h4 font-semibold">안녕하세요, FADE_1234님!</p>

          <div className="space-x-1 text-detail">
            <span className="text-gray-500">여자</span>
            <span>·</span>
            <span>FA:P 선정 0회</span>
          </div>
        </div>

        <ManageAccountButton />
      </div>

      <div className="flex min-h-1 flex-1 flex-col border border-red-400">
        <ul className="min-h-1 flex-1 space-y-3 overflow-y-scroll px-5 py-3">
          {mypageMenus.map((menuItem) => (
            <li key={`menu-${menuItem.id}`} onClick={() => handleMenuClick(menuItem)} className="flex cursor-pointer flex-row gap-1 rounded-lg bg-white px-5 py-3">
              <menuItem.IconComponent className="size-5 text-purple-500" />
              <span>{menuItem.name}</span>
            </li>
          ))}
        </ul>

        <LogoutButton />
      </div>
    </div>
  );
}

function ShowNotificationButton() {
  return (
    <button className="group relative cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100">
      <MdOutlineNotificationsNone className="size-6 transition-transform touchdevice:group-active:scale-95 pointerdevice:group-active:scale-95" />
    </button>
  );
}

function ManageAccountButton() {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    await showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: AccountSetting });
  };

  return (
    <button className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-detail" onClick={handleClick}>
      계정 관리
    </button>
  );
}

function LogoutButton() {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const handleClick = async () => {
    const result = await confirm({ title: '로그아웃 하시겠습니까?', description: '언제든 다시 로그인 할 수 있어요.' });

    result && navigate('/auth/signout', { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center py-1">
      <button className="font-semibold underline" onClick={handleClick}>
        로그아웃
      </button>

      <p className="text-detail text-gray-500">FADE팀 admin@fade.com</p>
    </div>
  );
}
