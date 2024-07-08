import { Variants, motion } from 'framer-motion';
import { PropsWithChildren } from 'react';

const slideUpVariants: Variants = {
  hide: { y: '100%', scale: '85%', opacity: '80%', transformOrigin: 'bottom' },
  show: { y: 0, scale: '100%', opacity: '100%' },
  exit: { y: '100%', scale: '85%', opacity: '80%', transition: { duration: 0.3 } },
};

const slideInFromRightVariants: Variants = {
  hide: { x: '100%', scale: '85%', opacity: '80%', transformOrigin: 'right' },
  show: { x: '0', scale: '100%', opacity: '100%' },
  exit: { x: '100%', scale: '85%', opacity: '80%', transition: { duration: 0.3 } },
};

type AnimateType = 'slideUp' | 'slideInFromRight';

const variantsMap: Record<AnimateType, Variants> = {
  slideUp: slideUpVariants,
  slideInFromRight: slideInFromRightVariants,
};

export function AnimatedDialog({ animateType = 'slideUp', children }: PropsWithChildren<{ animateType?: AnimateType }>) {
  return (
    <motion.div
      initial="hide"
      animate="show"
      exit="exit"
      variants={variantsMap[animateType]}
      className="pointer-events-auto absolute bottom-0 left-0 flex h-full w-full flex-col bg-white">
      {children}
    </motion.div>
  );
}
