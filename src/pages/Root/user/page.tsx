import { ProfileDetails } from '@Components/ProfileDetails';
import { useHeader } from '@Hooks/useHeader';
import { MdChevronLeft } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

export default function Page() {
  useHeader({ title: '계정 상세', leftSlot: () => <BackButton /> });

  return (
    <div className="flex h-full flex-col">
      <ProfileDetails viewType="user" />
    </div>
  );
}

function BackButton() {
  const navigate = useNavigate();

  return (
    <button className="group cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100" onClick={() => navigate(-1)}>
      <MdChevronLeft className="size-6 transition-transform group-active:scale-95" />
    </button>
  );
}
