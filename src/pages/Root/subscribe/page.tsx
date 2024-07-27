import { OUTFIT_CATEGORY_LIST, OUTFIT_STYLE_LIST } from '@/constants';
import testImage from '@Assets/test_fashion_image.jpg';
import { ReportButton } from '@Components/ReportButton';
import { ShowNotificationButton } from '@Components/ShowNotificationButton';
import { SubscribeButton } from '@Components/SubscribeButton';
import { Avatar } from '@Components/ui/avatar';
import { Image } from '@Components/ui/image';
import { useHeader } from '@Hooks/useHeader';
import { cn } from '@Utils/index';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { MdBookmark, MdChevronRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

type SubscribeBadgeType = {
  userId: number;
  profileURL: string;
  accountId: string;
};

const subscribeList: SubscribeBadgeType[] = [
  {
    userId: 0,
    profileURL: testImage,
    accountId: 'testaccount',
  },
  {
    userId: 1,
    profileURL: testImage,
    accountId: 'testaccount',
  },
  {
    userId: 2,
    profileURL: testImage,
    accountId: 'testaccount',
  },
  {
    userId: 3,
    profileURL: testImage,
    accountId: 'testaccount',
  },
  {
    userId: 4,
    profileURL: testImage,
    accountId: 'testaccount',
  },
];

export default function Page() {
  useHeader({ title: '구독', rightSlot: () => <ShowNotificationButton /> });

  return (
    <div className="relative flex h-full flex-col">
      <div className="relative h-fit w-full px-5 py-4">
        <div className="overflow-y-scroll">
          <ul className="flex flex-row gap-3">
            {subscribeList.map((subscribe) => (
              <li
                key={`subscribe-${subscribe.userId}`}
                className={cn('boder-gray-200 flex h-full flex-row items-center gap-2 rounded-lg border p-2', {
                  ['border-purple-100 bg-purple-50']: subscribe.userId === 0,
                })}>
                <Avatar src={subscribe.profileURL} size="32" />
                <span>{subscribe.accountId}</span>
              </li>
            ))}
          </ul>
        </div>

        <ShowSubscribeListViewButton />
      </div>

      {/* croll-snap-type: y mandatory; */}
      <div className="min-h-1 flex-1 snap-y snap-mandatory overflow-y-scroll">
        <FeedCard />
        <FeedCard />
        <FeedCard />
        <FeedCard />
      </div>
    </div>
  );
}

function BookmarkButton() {
  return (
    <button className="rounded-lg border bg-white px-3 py-2">
      <MdBookmark className="size-6 text-gray-500" />
    </button>
  );
}

function OutfitBadge({ categoryType }: { categoryType: number }) {
  return (
    <div className="min-w-fit rounded-[1rem] bg-purple-50 px-4 py-2">
      <span>{OUTFIT_CATEGORY_LIST[categoryType]}</span>
    </div>
  );
}

function FeedCard() {
  return (
    <div className="flex h-full snap-start border border-red-500">
      <section className="flex h-full w-full flex-col gap-3 p-5">
        <p className="text-h6">{format(new Date(), 'yyyy년 M월 dd일 eeee', { locale: ko })}</p>

        <Image src={testImage} className="relative w-full flex-1 rounded-lg bg-gray-200" size="contain">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn('absolute right-4 top-4')}>
            <ReportButton feedId={0} />
          </motion.div>
        </Image>

        <div className="flex flex-row items-center justify-center gap-3 rounded-lg bg-white">
          <Avatar src={testImage} size="32" />
          <AccountIdButton />
          <SubscribeButton userId={0} initialSubscribedStatus={true} onToggle={() => {}} />
          <BookmarkButton />
        </div>

        <div>
          <ul className="flex flex-row gap-2 overflow-y-scroll whitespace-nowrap">
            {OUTFIT_STYLE_LIST.slice(0, 6).map((value) => (
              <li className="rounded-2xl bg-purple-50 px-5 py-2 text-purple-400">{value}</li>
            ))}
          </ul>
        </div>

        <button type="button" className="flex w-full flex-row items-center gap-3 rounded-lg border border-purple-50 bg-white p-3">
          <OutfitBadge categoryType={0} />
          <p className="text-left">나이키 조던</p>
        </button>
      </section>
    </div>
  );
}

function ShowSubscribeListViewButton() {
  const navigate = useNavigate();

  return (
    <button className="absolute right-5 top-1/2 -translate-y-1/2 bg-fade-gradient px-2 py-4" onClick={() => navigate('/subscribe/list')}>
      <MdChevronRight className="size-6" />
    </button>
  );
}

function AccountIdButton() {
  const navigate = useNavigate();

  return (
    <button className="flex-1 text-left" onClick={() => navigate('/user', { state: { userId: 0 } })}>
      katie63
    </button>
  );
}
