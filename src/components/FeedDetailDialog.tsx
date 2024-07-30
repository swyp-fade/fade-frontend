import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import { DefaultModalProps } from '@Stores/modal';
import { TFeed } from '@Types/model';
import { FeedDetailCard } from './FeedDetailCard';
import { BackButton } from './ui/button';

type FeedDialogDialogProps = { feeds: TFeed[]; defaultViewIndex: number };

export function FeedDetailDialog({ feeds, defaultViewIndex, onClose }: DefaultModalProps<void, FeedDialogDialogProps>) {
  return (
    <FlexibleLayout.Root>
      <FlexibleLayout.Header>
        <header className="relative py-2">
          <BackButton onClick={onClose} />
          <p className="text-center text-2xl font-semibold">사진 상세</p>
        </header>
      </FlexibleLayout.Header>

      <FlexibleLayout.Content>
        <Feeds feeds={feeds} defaultViewIndex={defaultViewIndex} onUsernameClicked={onClose} />
      </FlexibleLayout.Content>
    </FlexibleLayout.Root>
  );
}

function Feeds({ feeds, defaultViewIndex, onUsernameClicked }: { feeds: TFeed[]; defaultViewIndex: number; onUsernameClicked: () => void }) {
  return (
    <div id="feedList" className="h-full snap-y snap-mandatory overflow-y-scroll">
      {feeds.map((feedDetail, index) => (
        <FeedDetailCard key={feedDetail.id} {...feedDetail} focus={index === defaultViewIndex} onUsernameClicked={onUsernameClicked} />
      ))}
    </div>
  );
}
