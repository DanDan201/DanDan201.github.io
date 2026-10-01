import { createContext, useEffect, useState } from 'react';
import type { SectionId } from '../content';

/** Tracks which section crosses the middle band of the viewport; `ids` must be stable. */
export function useActiveSection<T extends string>(ids: readonly T[]): T {
  const [active, setActive] = useState(ids[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const hit = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id as T);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );
    for (const id of ids) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/** The section currently in view, provided once by App so frames can lock on without prop drilling. */
export const ActiveSectionContext = createContext<SectionId>('intro');
