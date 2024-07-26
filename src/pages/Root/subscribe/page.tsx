import { OUTFIT_CATEGORY_LIST, OUTFIT_STYLE_LIST } from '@/constants';
import testImage from '@Assets/test_fashion_image.jpg';
import { ShowNotificationButton } from '@Components/ShowNotificationButton';
import { Image } from '@Components/ui/image';
import { useModalActions } from '@Hooks/modal';
import { useToastActions } from '@Hooks/toast';
import { useHeader } from '@Hooks/useHeader';
import { cn } from '@Utils/index';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { MdBookmark, MdChevronRight, MdReport } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { ReportBottomSheet, ReportResult } from '../voteFAP/components/ReportBottomSheet';

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
                <Image src={subscribe.profileURL} className="size-8 overflow-hidden rounded-lg" />
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

type ReportButtonProps = { onReportEnd: (result: ReportResult | undefined) => void };

function ReportButton({ onReportEnd }: ReportButtonProps) {
  const { showModal } = useModalActions();

  const handleReportClick = async () => {
    const reportResult = await startReportFlow();
    onReportEnd(reportResult);
  };

  const startReportFlow = async () => {
    // TODO: Report에 사진 ID? 유저 ID? 넘겨주긴 해야 함
    return await showModal<ReportResult>({ type: 'bottomSheet', Component: ReportBottomSheet });
  };

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('group absolute right-4 top-4 cursor-pointer rounded-lg bg-white px-2 py-1')}
      onClick={() => handleReportClick()}>
      <div className="flex flex-row items-center gap-1 transition-transform group-active:scale-95">
        <MdReport className="size-[1.125rem]" />
        <span>신고하기</span>
      </div>
    </motion.button>
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
  const { showToast } = useToastActions();

  const handleReportEnd = (reportResult?: ReportResult) => {
    if (reportResult === undefined) {
      return;
    }

    /** TODO: 신고 API 호출 */

    showToast({ type: 'basic', title: `신고되었습니다.` });
  };

  return (
    <div className="flex h-full snap-start border border-red-500">
      <section className="flex h-full w-full flex-col gap-3 p-5">
        <p className="text-h6">{format(new Date(), 'yyyy년 M월 dd일 eeee', { locale: ko })}</p>

        <Image src={testImage} className="relative w-full flex-1 rounded-lg bg-gray-200" size="contain">
          <ReportButton onReportEnd={handleReportEnd} />
        </Image>

        <div className="flex flex-row items-center justify-center gap-3 rounded-lg bg-white">
          <Image src={testImage} className="size-8 rounded-lg" />
          <AccountIdButton />
          <button className="rounded-lg border border-purple-50 bg-purple-50 px-3 py-2">구독중</button>
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
