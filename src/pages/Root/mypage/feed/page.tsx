import { BackButton } from '@Components/ui/button';
import { ProfileDetails } from '@Components/ProfileDetails';
import { useHeader } from '@Hooks/useHeader';
import { useNavigate } from 'react-router-dom';

export default function Page() {
  useHeader({
    title: '내 피드',
    leftSlot: () => <BackButton className="right-0" onClick={() => navigate('/mypage', { replace: true })} />,
  });

  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col">
      <ProfileDetails viewType="owner" />
    </div>
  );
}
