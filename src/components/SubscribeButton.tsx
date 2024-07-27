import { useMutation } from '@tanstack/react-query';
import { cn } from '@Utils/index';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { requestSubscribeMember } from '@Services/member';
import { useToastActions } from '@Hooks/toast';

type SubscribeButtonSize = 'default' | 'lg';

interface TSubscribeButton {
  userId: number;
  initialSubscribedStatus: boolean;
  onToggle: (value: boolean) => void;
  size?: SubscribeButtonSize;
}

type SubscribeButtonProps = TSubscribeButton;

export function SubscribeButton({ size = 'default', userId, initialSubscribedStatus, onToggle }: SubscribeButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribedStatus);
  const { showToast } = useToastActions();

  const { mutate: subscribeMember, isPending } = useMutation({
    mutationKey: ['subscribeMember'],
    mutationFn: requestSubscribeMember,
  });

  useEffect(() => {
    setIsSubscribed(initialSubscribedStatus);
  }, [initialSubscribedStatus]);

  const handleClick = () => {
    setIsSubscribed((prev) => !prev);

    subscribeMember(
      { toMemberId: userId, wouldSubscribe: !initialSubscribedStatus },
      {
        onSuccess() {
          onToggle(!initialSubscribedStatus);
        },
        onError() {
          setIsSubscribed((prev) => !prev);
          showToast({ type: 'error', title: '구독에 실패했어요.' });
        },
      }
    );
  };

  return (
    <Button
      variants="outline"
      interactive="onlyScale"
      className={cn(
        'whitespace-nowrap font-normal',
        {
          ['min-w-16 py-1']: size === 'default',
          ['min-w-20 py-2']: size === 'lg',
        },
        { ['bg-purple-50']: isSubscribed }
      )}
      disabled={isPending}
      onClick={handleClick}>
      {isSubscribed && '구독중'}
      {!isSubscribed && '구독'}
    </Button>
  );
}
