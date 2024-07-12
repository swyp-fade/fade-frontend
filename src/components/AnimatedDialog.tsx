import { cn } from '@Utils/index';
import { motion, Variants } from 'framer-motion';
import { Children, PropsWithChildren, ReactElement, useEffect, useRef, useState } from 'react';

const slideUpVariants: Variants = {
  hide: { y: '100%', scale: '85%', opacity: '80%', transformOrigin: 'bottom' },
  show: (height: number | null) => ({ y: 0, scale: '100%', height: height || '100%', opacity: '100%' }),
  exit: { y: '100%', scale: '85%', opacity: '80%', transition: { duration: 0.2 } },
};

const slideInFromRightVariants: Variants = {
  hide: { x: '100%', scale: '85%', opacity: '80%', transformOrigin: 'right' },
  show: { x: '0', scale: '100%', opacity: '100%' },
  exit: { x: '100%', scale: '85%', opacity: '80%', transition: { duration: 0.2 } },
};

type AnimateType = 'slideUp' | 'slideInFromRight';

const variantsMap: Record<AnimateType, Variants> = {
  slideUp: slideUpVariants,
  slideInFromRight: slideInFromRightVariants,
};

type ModalType = 'fullScreenDialog' | 'bottomSheet';

type AnimatedDialogProps = {
  animateType?: AnimateType;
  modalType?: ModalType;
};

export function AnimatedDialog({ animateType = 'slideUp', modalType = 'fullScreenDialog', children }: PropsWithChildren<AnimatedDialogProps>) {
  const isFullScreenDialog = modalType === 'fullScreenDialog';
  const isBottomSheet = modalType === 'bottomSheet';

  const childRef = useRef<HTMLDivElement>(null);
  const childElement = Children.only(children) as ReactElement;
  const ChildComponent = childElement.type;
  const childProps = childElement.props;

  const [boundHeight, setBoundHeight] = useState(0);

  useEffect(() => {
    if (!childRef.current) return;

    const childResizeObserver = new ResizeObserver(([entry]) => {
      const {
        contentRect: { height: childHeight },
      } = entry;

      setBoundHeight(childHeight);
    });

    childResizeObserver.observe(childRef.current);

    return () => childResizeObserver.disconnect();
  }, []);

  return (
    <motion.div
      layout
      initial="hide"
      animate="show"
      exit="exit"
      variants={variantsMap[animateType]}
      custom={boundHeight}
      className={cn('pointer-events-auto absolute flex w-full flex-col bg-white', {
        ['bottom-0 left-0 h-full']: isFullScreenDialog,
        ['bottom-0 left-0 h-fit rounded-t-2xl']: isBottomSheet,
      })}>
      {isBottomSheet && <ChildComponent ref={childRef} {...childProps} />}
      {isFullScreenDialog && children}
    </motion.div>
  );
}
