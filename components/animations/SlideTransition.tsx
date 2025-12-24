'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SlideTransitionProps {
  children: ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
}

export function SlideTransition({
  children,
  direction = 'right',
}: SlideTransitionProps) {
  const variants = {
    left: { x: -100 },
    right: { x: 100 },
    up: { y: -100 },
    down: { y: 100 },
  };

  return (
    <motion.div
      initial={{ ...variants[direction], opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ ...variants[direction], opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
