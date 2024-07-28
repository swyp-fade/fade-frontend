import { FeedDetailDialog } from '@Components/FeedDetailDialog';
import { Button } from '@Components/ui/button';
import { Image } from '@Components/ui/image';
import { useModalActions } from '@Hooks/modal';
import { requestFAPArchiving } from '@Services/feed';
import { useQuery } from '@tanstack/react-query';
import { TFAPArchivingFeed } from '@Types/model';
import { cn, isBetweenDate } from '@Utils/index';
import { addMonths, format, getDaysInMonth, getWeeksInMonth, isSameMonth, isSameYear, startOfDay, subMonths } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const MIN_DATE = new Date('2024-01-01');
const MAX_DATE = new Date();

export function FAPArchivingView() {
  const [calenderDate, setCalenderDate] = useState(format(new Date(), 'yyyy-MM'));

  const { data } = useQuery({
    queryKey: ['archiving', 'fap', calenderDate],
    queryFn: () => requestFAPArchiving({ selectedDate: calenderDate }),
  });

  const updateDate = (newDate: Date | null) => {
    /** Webkit에서 삭제 버튼 눌렀을 때 */
    if (newDate === null) {
      return setCalenderDate(format(new Date(), 'yyyy-MM'));
    }

    /** 유효성 검사 */
    if (!isBetweenDate(MIN_DATE, newDate, MAX_DATE)) {
      return setCalenderDate(format(new Date(), 'yyyy-MM'));
    }

    setCalenderDate(format(newDate, 'yyyy-MM'));
  };

  const weeksInMonth = getWeeksInMonth(calenderDate);
  const firstDayOfWeek = format(startOfDay(calenderDate), 'e');

  return (
    <div className="flex flex-1 flex-col p-5">
      <CalendarDateSelector
        calenderDate={calenderDate}
        onMonthSelected={updateDate}
        onPreMonthClicked={() => updateDate(subMonths(calenderDate, 1))}
        onNextMonthClicked={() => updateDate(addMonths(calenderDate, 1))}
      />

      <DayOfWeeksHeader />

      <div style={{ gridRow: weeksInMonth }} className={`grid flex-1 grid-cols-7 gap-x-2 gap-y-3`}>
        <AnimatePresence initial={false}>
          {data ? (
            data.feeds.map((feed, index) => <FAPFeeds index={index} firstDayOfWeek={firstDayOfWeek} feed={feed} feeds={data.feeds} />)
          ) : (
            <FAPFeedsLoading days={getDaysInMonth(calenderDate)} firstDayOfWeek={firstDayOfWeek} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface TCalendarDateSelector {
  calenderDate: string;
  onPreMonthClicked: () => void;
  onMonthSelected: (date: Date | null) => void;
  onNextMonthClicked: () => void;
}

type CalendarDateSelectorProps = TCalendarDateSelector;

function CalendarDateSelector({ calenderDate, onMonthSelected, onNextMonthClicked, onPreMonthClicked }: CalendarDateSelectorProps) {
  const isMinDate = isSameYear(calenderDate, MIN_DATE) && isSameMonth(calenderDate, MIN_DATE);
  const isMaxDate = isSameYear(calenderDate, MAX_DATE) && isSameMonth(calenderDate, MAX_DATE);

  return (
    <div className="relative flex justify-center rounded-lg border border-gray-200 py-2">
      <Button variants="ghost" size="icon" className="absolute left-1 top-1/2 -translate-y-1/2" disabled={isMinDate} onClick={() => onPreMonthClicked()}>
        <MdChevronLeft className="size-6" />
      </Button>

      {/* 나중에 Date Picker 진짜 바꿔야겠다 ... 개열받네 */}
      <div id="date_picker">
        <input
          type="month"
          className="relative whitespace-nowrap rounded-lg bg-gray-100 px-4 py-[.375rem] text-h6"
          value={calenderDate}
          onInput={(e) => onMonthSelected(e.currentTarget.valueAsDate)}
          min={format(MIN_DATE, 'yyyy-MM')}
          max={format(MAX_DATE, 'yyyy-MM')}
        />
      </div>

      <Button variants="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" disabled={isMaxDate} onClick={() => onNextMonthClicked()}>
        <MdChevronRight className="size-6" />
      </Button>
    </div>
  );
}

function DayOfWeeksHeader() {
  return (
    <div>
      <ul className="flex flex-row py-5">
        {['일', '월', '화', '수', '목', '금', '토'].map((dayOfWeek, index) => (
          <li
            key={`dayOfWeek-${index}`}
            className={cn('flex-1 text-center', {
              ['text-pink-400']: index === 0,
              ['text-purple-900']: index === 6,
            })}>
            {dayOfWeek}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface TFAPFeeds {
  index: number;
  firstDayOfWeek: string;
  feed: TFAPArchivingFeed;
  feeds: TFAPArchivingFeed[];
}

function FAPFeeds({ index, firstDayOfWeek, feed, feeds }: TFAPFeeds) {
  const { showModal } = useModalActions();

  const handleClick = async () => {
    await showModal({ type: 'fullScreenDialog', animateType: 'slideInFromRight', Component: FeedDetailDialog, props: { feeds, defaultViewIndex: index } });
  };

  return (
    <motion.div
      layout
      key={`$day-${index + 1}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={cn('flex h-full w-full flex-col')}
      style={{ gridColumnStart: index === 0 ? firstDayOfWeek : undefined }}
      onClick={handleClick}>
      <span className="ml-1">{index + 1}</span>
      <div className="group h-full w-full cursor-pointer overflow-hidden rounded-lg">
        <Image src={feed.imageURL} className="transition-transform group-hover:scale-105" />
      </div>
    </motion.div>
  );
}

function FAPFeedsLoading({ days, firstDayOfWeek }: { days: number; firstDayOfWeek: string }) {
  return Array.from({ length: days })
    .fill(0)
    .map((_, index) => (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        key={`$day-${index + 1}`}
        className={cn('flex h-full w-full animate-pulse flex-col rounded-lg')}
        style={{ gridColumnStart: index === 0 ? firstDayOfWeek : undefined }}>
        <span className="ml-1">{index + 1}</span>
        <div className="h-full w-full bg-gray-100" />
      </motion.div>
    ));
}
