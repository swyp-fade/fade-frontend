import testImage from '@Assets/test_fashion_image.jpg';
import { useHeader } from '@Hooks/useHeader';
import { cn, isBetweenDate } from '@Utils/index';
import { addMonths, format, getDaysInMonth, getWeeksInMonth, isSameMonth, isSameYear, startOfDay, subMonths } from 'date-fns';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useRef, useState, useTransition } from 'react';
import { MdChevronLeft, MdChevronRight, MdOutlineNotificationsNone, MdSearch } from 'react-icons/md';
import './dateStyle.css';

const MIN_DATE = new Date('2024-01-01');
const MAX_DATE = new Date();

/** 여기 레이아웃이 전체적으로 이상하네... */

const transitionVariants: Variants = {
  initial: (direction: number) => ({ x: `${-10 * direction}%`, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: `${10 * direction}%`, opacity: 0 }),
};

const baseAnimationProps = { initial: 'initial', animate: 'animate', exit: 'exit' };

export default function Page() {
  useHeader({
    title: 'FA:P 아카이브',
    leftSlot: () => <SearchButton />,
    rightSlot: () => <ShowNotificationButton />,
  });

  const startTransition = useTransition()[1];

  const [isTransitionInProgress, setIsTransitionInProgress] = useState(false);
  const [direction, setDirection] = useState(1);
  const [currentTabId, setCurrentTabId] = useState(0);

  const isFAPTab = currentTabId === 0;
  const isAllTab = currentTabId === 1;

  const switchToTab = (newTabId: number) => {
    const isSwitchToFAP = currentTabId - newTabId > 0;
    const newDirection = isSwitchToFAP ? 1 : -1;

    setIsTransitionInProgress(true);

    startTransition(() => {
      setDirection(newDirection);
      setCurrentTabId(newTabId);
    });
  };

  return (
    <div className="flex h-full flex-col">
      <menu className="sticky top-0 z-10 flex flex-row bg-white px-5">
        <li className="flex-1">
          <button className="relative h-full w-full py-3" onClick={() => switchToTab(0)} disabled={isTransitionInProgress}>
            <span className={cn('text-h6 font-semibold text-gray-500 transition-colors', { ['text-current']: isFAPTab })}>FA:P 아카이브</span>
            {isFAPTab && <TabIndicator />}
          </button>
        </li>
        <li className="flex-1">
          <button className="relative h-full w-full py-3" onClick={() => switchToTab(1)} disabled={isTransitionInProgress}>
            <span className={cn('text-h6 font-semibold text-gray-500 transition-colors', { ['text-current']: isAllTab })}>패션 전체보기</span>
            {isAllTab && <TabIndicator />}
          </button>
        </li>
      </menu>

      <div className="relative flex h-full">
        <AnimatePresence custom={direction} initial={false} onExitComplete={() => setIsTransitionInProgress(false)}>
          {isFAPTab && (
            <motion.div key="fap-view" className="absolute flex h-full w-full" custom={direction} variants={transitionVariants} {...baseAnimationProps}>
              <FAPArchivingView />
            </motion.div>
          )}
          {isAllTab && (
            <motion.div key="all-view" className="absolute flex h-full w-full" custom={direction} variants={transitionVariants} {...baseAnimationProps}>
              <AllArchivingView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SearchButton() {
  return (
    <button className="group cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100">
      <MdSearch className="size-6 transition-transform touchdevice:group-active:scale-95 pointerdevice:group-active:scale-95" />
    </button>
  );
}

function ShowNotificationButton() {
  return (
    <button className="group cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100">
      <MdOutlineNotificationsNone className="size-6 transition-transform touchdevice:group-active:scale-95 pointerdevice:group-active:scale-95" />
    </button>
  );
}

function TabIndicator() {
  return <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 h-1 w-full bg-purple-500" />;
}

function FAPArchivingView() {
  const inputDateRef = useRef<HTMLInputElement>(null);
  const [calenderDate, setCalenderDate] = useState(format(new Date(), 'yyyy-MM'));

  const isMinDate = isSameYear(calenderDate, MIN_DATE) && isSameMonth(calenderDate, MIN_DATE);
  const isMaxDate = isSameYear(calenderDate, MAX_DATE) && isSameMonth(calenderDate, MAX_DATE);

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
  // const columnStart = `[&>div:nth-child(1)]:col-start-${firstDayOfWeek}`;

  return (
    <div className="flex flex-1 flex-col p-5">
      <div className="relative flex justify-center rounded-lg border border-gray-200 py-2">
        {/* TODO: disabled css 처리 */}
        <button
          className="group absolute left-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100"
          onClick={() => updateDate(subMonths(calenderDate, 1))}
          disabled={isMinDate}>
          <MdChevronLeft className="size-6 transition-transform touchdevice:group-active:scale-95 pointerdevice:group-active:scale-95" />
        </button>

        {/* 나중에 Date Picker 진짜 바꿔야겠다 ... 개열받네 */}
        <div id="date_picker">
          <input
            ref={inputDateRef}
            type="month"
            className="relative whitespace-nowrap rounded-lg bg-gray-100 px-4 py-[.375rem] text-h6"
            value={calenderDate}
            defaultValue={format(new Date(), 'yyyy-MM')}
            onInput={(e) => updateDate(e.currentTarget.valueAsDate)}
            min={format(MIN_DATE, 'yyyy-MM')}
            max={format(MAX_DATE, 'yyyy-MM')}
          />
        </div>

        <button
          className="group absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 touchdevice:active:bg-gray-100 pointerdevice:hover:bg-gray-100"
          onClick={() => updateDate(addMonths(calenderDate, 1))}
          disabled={isMaxDate}>
          <MdChevronRight className="size-6 transition-transform touchdevice:group-active:scale-95 pointerdevice:group-active:scale-95" />
        </button>
      </div>

      <div>
        <ul className="flex flex-row py-5">
          {['일', '월', '화', '수', '목', '금', '토'].map((dayOfWeek, index) => (
            <li
              className={cn('flex-1 text-center', {
                ['text-pink-400']: index === 0,
                ['text-purple-900']: index === 6,
              })}>
              {dayOfWeek}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ gridRow: weeksInMonth }} className={`grid flex-1 grid-cols-7 gap-x-2 gap-y-3`}>
        {Array.from({ length: getDaysInMonth(calenderDate) })
          .fill(0)
          .map((_, index) => (
            <motion.div
              layout
              key={`$day-${index + 1}`}
              className={cn('flex h-full w-full flex-col')}
              style={{ gridColumnStart: index === 0 ? firstDayOfWeek : undefined }}>
              <span className="ml-1">{index + 1}</span>
              <div className="flex-1 rounded-lg bg-gray-100"></div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}

function AllArchivingView() {
  return (
    <div className="w-full border">
      {/* TODO: 나중에 스크롤 애니메이션 달아보기 */}
      <div className="w-full bg-white p-5">
        <button className="w-full rounded-lg bg-gray-100 py-2">필터</button>
      </div>

      <div className="grid w-full grid-cols-3 gap-1">
        {Array.from({ length: 13 })
          .fill(0)
          .map(() => (
            <div className="group aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-lg">
              <div
                style={{ backgroundImage: `url('${testImage}')` }}
                className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform group-hover:scale-105"
              />
            </div>
          ))}
      </div>
    </div>
  );
}
