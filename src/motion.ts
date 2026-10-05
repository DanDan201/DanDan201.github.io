import { stagger, useReducedMotion, useScroll, useTransform, type Transition, type Variants } from 'motion/react';
import { useContext, useSyncExternalStore, type RefObject } from 'react';
import type { SectionId } from './content';
import { RevealedSectionsContext } from './hooks/useActiveSection';

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

/*
 * Reveal variants. `visible` is the entrance; `hidden` carries the 200ms release so content
 * resets quickly as its section leaves the viewport, ready to play again on the next visit.
 */
export const fade: Variants = {
  hidden: { opacity: 0, transition: release },
  visible: { opacity: 1, transition: enter },
};

export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -16, transition: release },
  visible: { opacity: 1, x: 0, transition: enter },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, transition: release },
  visible: { opacity: 1, scale: 1, transition: enter },
};

/** Lines that draw along their length; the element's transform-origin decides where they start. */
export const drawX: Variants = {
  hidden: { scaleX: 0, transition: release },
  visible: { scaleX: 1, transition: draw },
};

/** The work timeline's track, drawn top to bottom. */
export const drawY: Variants = {
  hidden: { scaleY: 0, transition: release },
  visible: { scaleY: 1, transition: draw },
};

/** A timeline node lighting up as the track reaches it. */
export const nodeLight: Variants = {
  hidden: { opacity: 0.3, scale: 0.5, transition: release },
  visible: { opacity: 1, scale: 1, transition: enter },
};

/** Departure-board row flipping down into place (needs `perspective` on the parent). */
export const flap: Variants = {
  hidden: { opacity: 0, rotateX: -90, transition: release },
  visible: { opacity: 1, rotateX: 0, transition: { duration: 0.36, ease: easeOut } },
};

/** The name is uncovered by a panel sliding off to the right. */
export const shutter: Variants = {
  hidden: { x: '0%', transition: release },
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

/** The same lock, played inside a reveal tree (which reduced motion already skips). */
export const lockOnView: Variants = {
  hidden: lock.idle,
  visible: lock.locked,
};

/** The HUD layout starts at 62rem, mirroring the media queries in styles.css. */
const desktopQuery = window.matchMedia('(min-width: 62rem)');
// Module-level so useSyncExternalStore keeps one subscription instead of resubscribing every render.
const subscribeDesktop = (onChange: () => void) => {
  desktopQuery.addEventListener('change', onChange);
  return () => desktopQuery.removeEventListener('change', onChange);
};
const isDesktop = () => desktopQuery.matches;

/**
 * Desktop with motion allowed: sections run as a pinned stage. Mirrors the
 * `(min-width: 62rem) and (prefers-reduced-motion: no-preference)` block in styles.css.
 */
export function useStageMode(): boolean {
  const reduce = useReducedMotion();
  const desktop = useSyncExternalStore(subscribeDesktop, isDesktop);
  return desktop && !reduce;
}

/**
 * Props for the root of a variant tree; replays every visit. On the stage the content plays in when
 * its section becomes active (already on screen behind the wipe) and resets once the section is out
 * of sight; in the stacked mobile flow it plays when it scrolls into view. Reduced motion renders the
 * final state.
 */
export function useReveal(id: SectionId) {
  const reduce = useReducedMotion();
  const stage = useStageMode();
  const revealed = useContext(RevealedSectionsContext).has(id);
  if (reduce) return { initial: false, animate: 'visible' } as const;
  if (stage) return { initial: 'hidden', animate: revealed ? 'visible' : 'hidden' } as const;
  return { initial: 'hidden', whileInView: 'visible', viewport: { margin: '-80px' } } as const;
}

// Scroll lengths of one stage transition and of the still hold between transitions, in svh.
// Mirror --fade and --hold in styles.css.
const FADE = 70;
const HOLD = 30;

/**
 * Scroll-scrubbed stage transition. The next stage wipes in top-to-bottom; the previous dims and
 * shrinks away over the last FADE. The same pinned-progress mapping is used in both directions,
 * so scrolling up retraces the downward animation without a direction-dependent jump.
 */
export function useStage(ref: RefObject<HTMLElement | null>, place: 'first' | 'middle' | 'last') {
  const enabled = useStageMode();
  const { scrollYProgress: pinned } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const length = place === 'middle' ? 2 * FADE + HOLD : FADE + HOLD;
  const wipeEnd = place === 'first' ? 0 : FADE / length;
  const leaveStart = place === 'last' ? 1 : (length - FADE) / length;
  const arriving = useTransform(pinned, p => (wipeEnd === 0 ? 1 : Math.min(p / wipeEnd, 1)));
  const leaving = useTransform(pinned, p => (leaveStart === 1 ? 0 : Math.max((p - leaveStart) / (1 - leaveStart), 0)));
  const clipPath = useTransform(arriving, a => `inset(0 0 ${(1 - a) * 100}% 0)`);
  const opacity = useTransform(leaving, l => 1 - l);
  const scale = useTransform(leaving, l => 1 - l * 0.04);
  const scanY = useTransform(arriving, a => `${a * 100}svh`);
  const scanOpacity = useTransform(arriving, a => (a > 0 && a < 1 ? 1 : 0));
  return {
    enabled,
    leaving,
    style: enabled ? (place === 'first' ? { opacity, scale } : { clipPath, opacity, scale }) : undefined,
    scan: enabled && place !== 'first' ? { y: scanY, opacity: scanOpacity } : undefined,
  };
}
