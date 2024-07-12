import { AnimatedDialog } from '@Components/AnimatedDialog';
import { DialogOverlay } from '@Components/DialogOverlay';
import { FlexibleLayout } from '@Layouts/FlexibleLayout';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { cn } from '@Utils/index';
import { AnimatePresence, motion } from 'framer-motion';
import { PropsWithChildren, ReactNode, useState } from 'react';

type HowToVoteModalProp = {
  triggerSlot: ReactNode;
};

export function HowToVoteModal({ triggerSlot }: HowToVoteModalProp) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <AlertDialog.Root open={isOpened} onOpenChange={setIsOpened}>
      {triggerSlot && <AlertDialog.Trigger asChild>{triggerSlot}</AlertDialog.Trigger>}

      <AnimatePresence>
        {isOpened && (
          <AlertDialog.Portal forceMount container={document.getElementById('portalSection')!}>
            <AlertDialog.Overlay>
              <DialogOverlay onClick={() => setIsOpened(false)} />
            </AlertDialog.Overlay>

            <AlertDialog.Title />

            <AlertDialog.Content>
              <VisuallyHidden>
                <AlertDialog.AlertDialogDescription>This description is hidden from sighted users but accessible to screen readers.</AlertDialog.AlertDialogDescription>
              </VisuallyHidden>

              <AnimatedDialog modalType="modal" animateType="showAtCenter">
                <FlexibleLayout.Root className="w-full">
                  <FlexibleLayout.Header>
                    <header className="relative px-5 py-4">
                      <p className="text-center text-2xl font-semibold">FA:P 투표 방법</p>
                    </header>
                  </FlexibleLayout.Header>

                  <Carousel onLastClick={() => setIsOpened(false)} />
                </FlexibleLayout.Root>
              </AnimatedDialog>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        )}
      </AnimatePresence>
    </AlertDialog.Root>
  );
}

type CarouselItem = {
  image: string;
  description: string;
};

const carouselList: CarouselItem[] = [
  {
    image: 'https://img.khan.co.kr/news/2024/02/03/news-p.v1.20240131.e92b61eee105426b8fb091a0d5d8b0fe_P1.jpg',
    description: `FA:P 선정에 동의한다면 오른쪽으로 스와이프해 FADE IN,\n동의하지 않는다면 왼쪽으로 스와이프해 FADE OUT!`,
  },
  {
    image: 'https://img.khan.co.kr/news/2024/02/03/news-p.v1.20240131.e92b61eee105426b8fb091a0d5d8b0fe_P1.jpg',
    description: `공정한 투표를 위해 투표가 진행되는 동안은\n계정명이 가려지며 익명으로 진행돼요!`,
  },
  {
    image: 'https://img.khan.co.kr/news/2024/02/03/news-p.v1.20240131.e92b61eee105426b8fb091a0d5d8b0fe_P1.jpg',
    description: `가장 많은 FADE IN을 받은 사진은\n그날의 FA:P로 선정돼요.\n마음에 드는 사진은 북마크하고,\n다른 유저를 구독해 다양한 패션을 확인해보세요!`,
  },
];

function Carousel({ onLastClick }: { onLastClick: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const isLastStep = currentStep === carouselList.length - 1;

  const handleNextCarousel = () => {
    if (isLastStep) {
      return onLastClick();
    }

    setCurrentStep(currentStep + 1);
  };

  return (
    <>
      <FlexibleLayout.Content className="flex h-full w-full">
        <div className="relative flex flex-1 flex-col gap-5 overflow-hidden">
          <CarouselImageSection currentStep={currentStep} />
          <CarouselNav currentStep={currentStep} />
        </div>
      </FlexibleLayout.Content>

      <FlexibleLayout.Footer>
        <div className="flex p-4">
          <NextCarouselButton onClick={handleNextCarousel}>
            {!isLastStep && '다음'}
            {isLastStep && '확인'}
          </NextCarouselButton>
        </div>
      </FlexibleLayout.Footer>
    </>
  );
}

function CarouselImageSection({ currentStep }: { currentStep: number }) {
  return (
    <motion.ul animate={{ x: `-${currentStep * 100}%` }} className="flex h-full flex-row whitespace-nowrap">
      {carouselList.map((carouselItem, index) => (
        <CarouselItem key={`carousel-item-${index}`} {...carouselItem} />
      ))}
    </motion.ul>
  );
}

function CarouselItem({ description, image }: CarouselItem) {
  return (
    <li className="flex h-full min-w-full flex-col items-center justify-center">
      <div className="flex flex-1 items-center justify-center">
        <img src={image} className="max-h-[13.125rem] w-full object-contain" />
      </div>
      <p className="whitespace-pre-line text-center">{description}</p>
    </li>
  );
}

function CarouselNav({ currentStep }: { currentStep: number }) {
  return (
    <ul className="flex h-fit w-full flex-1 flex-row items-center justify-center gap-3">
      {carouselList.map((_, index) => (
        <CarouselNavItem key={`carousel-nav-${index}`} isActive={index === currentStep} />
      ))}
    </ul>
  );
}

function CarouselNavItem({ isActive }: { isActive: boolean }) {
  return <li className={cn('size-2 rounded-full bg-gray-200 transition-colors', { ['bg-purple-700']: isActive })} />;
}

function NextCarouselButton({ onClick, children }: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button type="button" className="flex-1 rounded-lg bg-gray-200 py-2 text-xl text-black transition-colors" onClick={onClick}>
      {children}
    </button>
  );
}
