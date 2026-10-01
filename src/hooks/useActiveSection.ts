import { createContext, useEffect, useRef, useState } from 'react';
import { useScroll, useTransform } from 'motion/react';
import type { SectionId } from '../content';

/**
 * Where the reader is: the active section (nearest rest), the sections whose content is played in,
 * and a 0..1 progress across sections. A section's rest is where an anchor link lands, its top minus
 * its scroll-margin-top, so the same code serves the stacked mobile flow and the pinned desktop stage
 * (whose sections use a negative margin to land after their wipe).
 *
 * On the stage a section is on screen from its slot top (its wipe starts) until the next section is
 * at rest (the wipe over it ends). Content plays in once a section becomes active, or as soon as it
 * starts being uncovered from underneath when scrolling back; it is kept while on screen and reset
 * once out of sight, so every return replays it. `ids` must be stable.
 */
export function useSectionTracking<T extends string>(ids: readonly T[]) {
  const { scrollY } = useScroll();
  const tops = useRef<number[]>([]);
  const rests = useRef<number[]>([]);
  const [active, setActive] = useState(ids[0]);
  const [revealed, setRevealed] = useState<ReadonlySet<T>>(() => new Set([ids[0]]));

  useEffect(() => {
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
          if (i === nearest || (onScreen && (i < nearest || previous.has(id)))) next.add(id);
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
    const unsubscribe = scrollY.on('change', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
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
