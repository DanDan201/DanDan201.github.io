import { createContext, useEffect, useRef, useState } from 'react';
import { useScroll, useTransform } from 'motion/react';
import type { SectionId } from '../content';

/**
 * Where the reader is: the active section (nearest rest), the sections whose content is played in,
 * and a 0..1 progress across sections. A section's rest is where an anchor link lands, its top minus
 * its scroll-margin-top, so the same code serves the stacked mobile flow and the pinned desktop stage
 * (whose sections use a negative margin to land after their wipe).
 *
 * On the stage a section is on screen from its slot top (the wipe begins) until the next section
 * is at rest. Content plays in as soon as it starts being uncovered in either scroll direction;
 * it is kept while on screen and reset once out of sight, so every return replays it. `ids` must
 * be stable.
 */
export function useSectionTracking<T extends string>(ids: readonly T[]) {
  const { scrollY } = useScroll();
  const tops = useRef<number[]>([]);
  const rests = useRef<number[]>([]);
  const [active, setActive] = useState(ids[0]);
  const [revealed, setRevealed] = useState<ReadonlySet<T>>(() => new Set([ids[0]]));

  useEffect(() => {
    const desktopStage = window.matchMedia('(min-width: 62rem) and (prefers-reduced-motion: no-preference)');
    let wheelDistance = 0;
    let wheelDirection = 0;
    let wheelIdleTimer = 0;
    let scrollIdleTimer = 0;
    let scrollFallbackTimer = 0;
    let navigating = false;
    let wheelSettled = true;
    let scrollSettled = true;

    const finishNavigation = () => {
      if (navigating && wheelSettled && scrollSettled) {
        navigating = false;
        window.clearTimeout(scrollFallbackTimer);
      }
    };

    const noteWheel = () => {
      wheelSettled = false;
      window.clearTimeout(wheelIdleTimer);
      wheelIdleTimer = window.setTimeout(() => {
        wheelSettled = true;
        wheelDistance = 0;
        wheelDirection = 0;
        finishNavigation();
      }, 180);
    };

    const onScroll = () => {
      if (!navigating) return;
      scrollSettled = false;
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        scrollSettled = true;
        finishNavigation();
      }, 140);
    };

    // One vertical wheel burst advances one desktop waypoint; keyboard and touch input stay native.
    const onWheel = (event: WheelEvent) => {
      if (
        !desktopStage.matches ||
        event.ctrlKey ||
        event.shiftKey ||
        Math.abs(event.deltaY) <= Math.abs(event.deltaX)
      ) return;

      if (navigating) {
        event.preventDefault();
        noteWheel();
        return;
      }

      const multiplier = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? window.innerHeight
          : 1;
      const delta = event.deltaY * multiplier;
      const direction = Math.sign(delta);
      if (!direction) return;
      if (direction !== wheelDirection) {
        wheelDistance = 0;
        wheelDirection = direction;
      }
      wheelDistance += Math.abs(delta);
      noteWheel();
      if (wheelDistance < 32) return;

      const stops = rests.current;
      if (stops.length < 2) return;
      const y = scrollY.get();
      let current = 0;
      for (let i = 1; i < stops.length; i++) {
        if (Math.abs(stops[i] - y) < Math.abs(stops[current] - y)) current = i;
      }
      const next = current + direction;
      if (next < 0 || next >= stops.length || Math.abs(stops[next] - y) < 1) return;

      event.preventDefault();
      navigating = true;
      scrollSettled = false;
      window.clearTimeout(scrollFallbackTimer);
      scrollFallbackTimer = window.setTimeout(() => {
        scrollSettled = true;
        finishNavigation();
      }, 1500);
      window.scrollTo({ top: stops[next], behavior: 'smooth' });
    };

    const update = () => {
      const y = scrollY.get();
      const stops = rests.current;
      let nearest = 0;
      for (let i = 1; i < stops.length; i++) {
        if (Math.abs(stops[i] - y) < Math.abs(stops[nearest] - y)) nearest = i;
      }
      setActive(ids[nearest]);
      setRevealed(previous => {
        const next = new Set<T>();
        ids.forEach((id, i) => {
          const onScreen = y >= tops.current[i] - 1 && (i === ids.length - 1 || y < stops[i + 1]);
          if (i === nearest || onScreen) next.add(id);
        });
        return next.size === previous.size && [...next].every(id => previous.has(id)) ? previous : next;
      });
    };
    const measure = () => {
      // Short trailing sections can sit below the last reachable offset; clamp so the end stays reachable.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const sections = ids.map(id => document.getElementById(id));
      tops.current = sections.map(section => (section ? section.getBoundingClientRect().top + window.scrollY : 0));
      rests.current = sections.map((section, i) => {
        const margin = section ? parseFloat(getComputedStyle(section).scrollMarginTop) || 0 : 0;
        return Math.min(Math.max(tops.current[i] - margin, 0), max);
      });
      update();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    const unsubscribe = scrollY.on('change', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(wheelIdleTimer);
      window.clearTimeout(scrollIdleTimer);
      window.clearTimeout(scrollFallbackTimer);
      unsubscribe();
    };
  }, [ids, scrollY]);

  // Piecewise-linear between rests, so progress hits i / (n - 1) exactly when section i is at rest.
  const progress = useTransform(scrollY, y => {
    const stops = rests.current;
    for (let i = 1; i < stops.length; i++) {
      if (y < stops[i]) return (i - 1 + Math.max(0, y - stops[i - 1]) / (stops[i] - stops[i - 1])) / (stops.length - 1);
    }
    return stops.length > 1 ? 1 : 0;
  });

  return { active, revealed, progress };
}

/** The section currently in view, provided once by App so frames can lock on without prop drilling. */
export const ActiveSectionContext = createContext<SectionId>('intro');

/** Sections whose content is currently played in on the desktop stage (see useSectionTracking). */
export const RevealedSectionsContext = createContext<ReadonlySet<SectionId>>(new Set(['intro']));
