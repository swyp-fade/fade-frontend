import { useMutation } from '@tanstack/react-query';
import { cn } from '@Utils/index';
import { useState } from 'react';
import { Button } from './ui/button';

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

  const subscribeMutation = useMutation({
    mutationKey: ['subscribe'],
    mutationFn: ({ userId }: { userId: number }) => new Promise((resolve) => resolve(userId)),
  });

  const unsubscribeButton = useMutation({
    mutationKey: ['unsubscribe'],
    mutationFn: ({ userId }: { userId: number }) => new Promise((resolve) => resolve(userId)),
  });

  const isPending = subscribeMutation.isPending || unsubscribeButton.isPending;

  const handleClick = () => {
    setIsSubscribed((prev) => !prev);

    if (!isSubscribed) {
      return subscribeMutation.mutate(
        { userId },
        {
          onSuccess() {
            onToggle(!initialSubscribedStatus);
          },
          onError() {
            setIsSubscribed((prev) => !prev);
          },
        }
      );
    }

    unsubscribeButton.mutate(
      { userId },
      {
        onSuccess() {
          onToggle(!initialSubscribedStatus);
        },
        onError() {
          setIsSubscribed((prev) => !prev);
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
