import { ProfileDetails } from '@Components/AccountProfileView';
import { useHeader } from '@Hooks/useHeader';
import { MdChevronLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function Page() {
  useHeader({
    title: '내 피드',
    leftSlot: () => <BackButton onClick={() => navigate('/mypage', { replace: true })} />,
  });

  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col">
      <ProfileDetails viewType="owner" />
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="group cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100" onClick={onClick}>
      <MdChevronLeft className="size-6 transition-transform group-active:scale-95" />
    </button>
  );
}
