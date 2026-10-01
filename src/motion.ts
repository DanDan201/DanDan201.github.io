import { stagger, useReducedMotion, useScroll, useTransform, type Transition, type Variants } from 'motion/react';
import { useSyncExternalStore, type RefObject } from 'react';

/** Motion tokens from DESIGN.md. Entrances ease out (quint); releases ease in. */
export const easeOut = [0.22, 1, 0.36, 1] as const;
const easeIn = [0.64, 0, 0.78, 0] as const;

export const enter: Transition = { duration: 0.28, ease: easeOut };
const lockIn: Transition = { duration: 0.32, ease: easeOut };
const release: Transition = { duration: 0.2, ease: easeIn };
const draw: Transition = { duration: 0.48, ease: easeOut };

export const staggerGroup = (interval: number, startDelay = 0): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren: stagger(interval, { startDelay }) } },
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
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: enter },
};

/** Lines that draw along their length; the element's transform-origin decides where they start. */
export const drawX: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: draw },
};

/** Departure-board row flipping down into place (needs `perspective` on the parent). */
export const flap: Variants = {
  hidden: { opacity: 0, rotateX: -90 },
  visible: { opacity: 1, rotateX: 0, transition: { duration: 0.36, ease: easeOut } },
};

/** The name is uncovered by a panel sliding off to the right. */
export const shutter: Variants = {
  hidden: { x: '0%' },
  visible: { x: '101%', transition: { duration: 0.52, ease: easeOut } },
};

/**
 * Corner brackets closing on a target; `idle`/`locked` follow the active section.
 * `custom={true}` (reduced motion) switches state with no transition at all.
 */
export const lock: Variants = {
  idle: (instant?: boolean) => ({ opacity: 0, scale: 1.3, transition: instant ? { duration: 0 } : release }),
  locked: (instant?: boolean) => ({ opacity: 1, scale: 1, transition: instant ? { duration: 0 } : lockIn }),
};

/** The same lock, played once inside a reveal tree (which reduced motion already skips). */
export const lockOnView: Variants = {
  hidden: lock.idle,
  visible: lock.locked,
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

/** The HUD layout (tape, snap, depth) starts at 62rem, mirroring the media queries in styles.css. */
const desktopQuery = window.matchMedia('(min-width: 62rem)');
// Module-level so useSyncExternalStore keeps one subscription instead of resubscribing every render.
const subscribeDesktop = (onChange: () => void) => {
  desktopQuery.addEventListener('change', onChange);
  return () => desktopQuery.removeEventListener('change', onChange);
};
const isDesktop = () => desktopQuery.matches;

/** Scroll-linked transforms run on the desktop HUD layout only, and never with reduced motion. */
export function useScrollMotion(): boolean {
  const reduce = useReducedMotion();
  const desktop = useSyncExternalStore(subscribeDesktop, isDesktop);
  return desktop && !reduce;
}

/**
 * Scroll-linked depth for a section's content: it rises into place while the section's top
 * travels up the viewport, then shrinks, dims and drifts up while the section's bottom leaves.
 * Undefined (no binding) on mobile and with reduced motion, so content stays put there.
 */
export function useSectionDepth(ref: RefObject<HTMLElement | null>) {
  const enabled = useScrollMotion();
  const { scrollYProgress: arriving } = useScroll({ target: ref, offset: ['start end', 'start start'] });
  const { scrollYProgress: leaving } = useScroll({ target: ref, offset: ['end end', 'end start'] });
  const y = useTransform([arriving, leaving], ([a, l]: number[]) => `${(1 - a) * 8 - l * 6}vh`);
  const scale = useTransform([arriving, leaving], ([a, l]: number[]) => (0.96 + a * 0.04) * (1 - l * 0.06));
  const opacity = useTransform([arriving, leaving], ([a, l]: number[]) => Math.min(0.3 + a * 0.7, 1 - l * 0.7));
  return enabled ? { y, scale, opacity } : undefined;
}
