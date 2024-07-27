import testImage from '@Assets/test_fashion_image.jpg';
import { useModalActions } from '@Hooks/modal';
import { MdEditNote } from 'react-icons/md';
import { ProfileIntroEditBottomSheet } from './ProfileIntroEditBottomSheet';
import { SubscribeButton } from './SubscribeButton';
import { Avatar } from './ui/avatar';
import { Button } from './ui/button';
import { Grid } from './ui/grid';
import { Image } from './ui/image';

export type ProfileViewType = 'owner' | 'user';

export function ProfileDetails({ viewType }: { viewType: ProfileViewType }) {
  const isOwnerView = viewType === 'owner';
  const isUserView = viewType === 'user';

  return (
    <div>
      <div className="space-y-5 p-5">
        <div className="flex flex-row items-center gap-3">
          <Avatar src={testImage} size="72" />

          <div className="flex flex-1 flex-col justify-center">
            <span className="font-semibold">fade_1234</span>

            <div className="space-x-2">
              <span>구독자</span>
              <span>50</span>
            </div>
          </div>

          {isUserView && <SubscribeButton userId={0} initialSubscribedStatus={true} onToggle={() => {}} size="lg" />}
        </div>

        <div className="flex flex-col">
          <p className="whitespace-pre-line">{`NYC, 28\nobsessed with fashion, photography, and love`}</p>

          {isOwnerView && <EditProfileIntroButton />}
        </div>
      </div>

      <div className="p-1">
        <Grid cols={3}>
          {Array.from({ length: 13 })
            .fill(0)
            .map((_, index) => (
              <div key={`item-${index}`} className="group aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-lg">
                <Image src={testImage} className="transition-transform group-hover:scale-105" />
              </div>
            ))}
        </Grid>
      </div>
    </div>
  );
}

function EditProfileIntroButton() {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    await showModal({ type: 'bottomSheet', Component: ProfileIntroEditBottomSheet, props: { defaultProfileIntro: 'hihi' } });
  };

  return (
    <Button variants="ghost" size="icon" className="ml-auto w-fit" onClick={handleClick}>
      <MdEditNote className="size-6" />
    </Button>
  );
}
