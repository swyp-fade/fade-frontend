import testImage from '@Assets/test_fashion_image.jpg';
import { SubscribeButton } from '@Components/SubscribeButton';
import { Avatar } from '@Components/ui/avatar';
import { BackButton } from '@Components/ui/button';
import { useHeader } from '@Hooks/useHeader';
import { useNavigate } from 'react-router-dom';

export default function Page() {
  const navigate = useNavigate();
  useHeader({ title: '구독 목록', leftSlot: () => <BackButton className="left-0" onClick={() => navigate('/subscribe', { replace: true })} /> });

  return (
    <div className="relative flex h-full flex-col">
      <ul>
        <li>
          <SubscribeItem />
        </li>
      </ul>
    </div>
  );
}

function SubscribeItem() {
  return (
    <div className="fle-row flex items-center gap-3 rounded-lg bg-white p-3">
      <Avatar src={testImage} size="40" />
      <p className="flex-1">fade1234</p>
      <SubscribeButton userId={0} initialSubscribedStatus={true} onToggle={() => {}} size="lg" />
    </div>
  );
}
