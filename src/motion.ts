import { stagger, useReducedMotion, type Transition, type Variants } from 'motion/react';

/** Entrance timing shared by every section: 280ms ease-out-quint. */
export const easeOut = [0.22, 1, 0.36, 1] as const;
export const enter: Transition = { duration: 0.28, ease: easeOut };

export const staggerGroup = (interval: number): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren: stagger(interval) } },
});

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: enter },
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: enter },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: enter },
};

/**
 * Props for the root of a variant tree. Plays `hidden -> visible` once, on mount or when
 * the element first scrolls into view. With reduced motion the final state renders
 * immediately, so content never waits on an animation.
 */
export function useReveal(trigger: 'mount' | 'scroll') {
  const reduce = useReducedMotion();
  if (reduce) return { initial: false, animate: 'visible' } as const;
  if (trigger === 'mount') return { initial: 'hidden', animate: 'visible' } as const;
  return { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '-80px' } } as const;
}
