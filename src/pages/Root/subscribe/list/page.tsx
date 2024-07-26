import testImage from '@Assets/test_fashion_image.jpg';
import { BackButton } from '@Components/ui/button';
import { Avatar } from '@Components/ui/avatar';
import { useHeader } from '@Hooks/useHeader';
import { cn } from '@Utils/index';
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
      <SubscribeToggleButton />
    </div>
  );
}

function SubscribeToggleButton() {
  const isSubscribed = true;

  return (
    <button
      className={cn('w-[5rem] whitespace-nowrap rounded-lg border border-gray-200 bg-white py-2 transition-colors', {
        ['border-purple-50 bg-purple-50']: isSubscribed,
      })}>
      {isSubscribed && '구독중'}
      {!isSubscribed && '구독'}
    </button>
  );
}
