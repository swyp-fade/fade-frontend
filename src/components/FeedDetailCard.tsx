import { OUTFIT_STYLE_LIST } from '@/constants';
import { ItemBadge } from '@Components/ItemBadge';
import { ReportButton } from '@Components/ReportButton';
import { SubscribeButton } from '@Components/SubscribeButton';
import { Avatar } from '@Components/ui/avatar';
import { Image } from '@Components/ui/image';
import { isTFeedDetailMine, isTFeedDetailVote, TFeedAdittionalDetail, TFeedDetail } from '@Types/model';
import { cn } from '@Utils/index';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { MdBookmark, MdHowToVote, MdReport } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { BookmarkButton } from './BookmarkButton';
import { OutfitCard } from './OutfitCard';
import { Button } from './ui/button';
import { ReactNode } from 'react';

export function FeedDetailCard(feedDetail: TFeedDetail) {
  const isVoteType = isTFeedDetailVote(feedDetail);
  const isMineType = isTFeedDetailMine(feedDetail);

  const { accountId, createdAt, feedId, imageURL, isBookmarked, isFAPFeed, isMine, isSubscribed, memberId, outfits, styleIds, profileImageURL } = feedDetail;

  const haveStyleIds = styleIds.length !== 0;

  const haveOutfits = outfits.length !== 0;
  const haveOutfitsMoreThanOwn = outfits.length > 1;

  return (
    <div className="flex h-full snap-start border border-red-500">
      <section className="flex h-full w-full flex-col gap-3 p-5">
        {isVoteType && <p className="text-h6">{format(feedDetail.votedAt, 'yyyy년 M월 dd일 eeee', { locale: ko })}</p>}
        {!isVoteType && <p className="text-h6">{format(feedDetail.createdAt, 'yyyy년 M월 dd일 eeee', { locale: ko })}</p>}

        <Image
          src={imageURL}
          className={cn('relative w-full flex-1 rounded-lg bg-gray-200', {
            ['boder-2 border-purple-500']: isFAPFeed,
          })}
          size="contain">
          {!isMine && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn('absolute right-4 top-4')}>
              <ReportButton feedId={feedId} />
            </motion.div>
          )}
        </Image>

        {isMineType && <FeedAdiitionalDetails {...feedDetail} />}
        {!isMineType && <MemberDetailCard {...feedDetail} />}
        {haveStyleIds && <StyleCard {...feedDetail} />}
        {haveOutfits && <OutfitCard {...outfits.at(0)!} wouldShowDetail={false} />}
        {haveOutfitsMoreThanOwn && <ShowAllOutfitsButton />}
      </section>
    </div>
  );
}

function AccountIdButton({ userId, accountId }: { userId: number; accountId: string }) {
  const navigate = useNavigate();

  return (
    <div className="flex-1 text-left">
      <Button variants="ghost" interactive="onlyScale" className="px-0 py-1 font-normal" onClick={() => navigate('/user', { state: { userId } })}>
        {accountId}
      </Button>
    </div>
  );
}

function StyleCard({ styleIds }: TFeedDetail) {
  return (
    <div>
      <ul className="flex flex-row gap-2 overflow-y-scroll whitespace-nowrap">
        {styleIds.map((value, index) => (
          <ItemBadge key={`style-badge-${index}`} variants="primary">
            {OUTFIT_STYLE_LIST.at(value)}
          </ItemBadge>
        ))}
      </ul>
    </div>
  );
}

function MemberDetailCard({ profileImageURL, memberId, isSubscribed, isBookmarked, feedId, accountId }: TFeedDetail) {
  return (
    <div className="flex flex-row items-center justify-center gap-3 rounded-lg bg-white">
      <Avatar src={profileImageURL} size="32" />
      <AccountIdButton userId={memberId} accountId={accountId} />
      <SubscribeButton userId={memberId} initialSubscribedStatus={isSubscribed} onToggle={() => {}} />
      <BookmarkButton feedId={feedId} defaultBookmarkStatus={isBookmarked} />
    </div>
  );
}

function FeedAdiitionalDetails({ bookmarkCount, fadeInCount, reportCount }: TFeedAdittionalDetail) {
  return (
    <ul className="flew-row flex gap-2">
      <FeedAdiitionalDetailItem IconRender={<MdHowToVote className="mx-auto size-5" />} detailName="FADE IN" count={fadeInCount} />
      <FeedAdiitionalDetailItem IconRender={<MdBookmark className="mx-auto size-5 text-purple-500" />} detailName="북마크" count={bookmarkCount} />
      <FeedAdiitionalDetailItem IconRender={<MdReport className="mx-auto size-5 text-pink-400" />} detailName="신고" count={reportCount} />
    </ul>
  );
}

function FeedAdiitionalDetailItem({ IconRender, detailName, count }: { IconRender: ReactNode; detailName: string; count: number }) {
  return (
    <li className="gap borer-gray-200 flex flex-1 flex-col items-center justify-center gap-1 rounded-lg border py-3">
      <div className="space-y-0.5">
        {IconRender}
        <p>{detailName}</p>
      </div>

      <span className="font-semibold">{count}</span>
    </li>
  );
}

function ShowAllOutfitsButton() {
  return <Button variants="ghost">착장 정보 전체보기</Button>;
}
