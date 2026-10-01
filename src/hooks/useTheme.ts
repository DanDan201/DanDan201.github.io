import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

type Theme = 'light' | 'dark';

const root = document.documentElement;
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

/** Explicit choice (set pre-paint by index.html from localStorage) wins over the OS preference. */
function currentTheme(): Theme {
  const chosen = root.dataset.theme;
  if (chosen === 'light' || chosen === 'dark') return chosen;
  return darkQuery.matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState(currentTheme);
  const reduce = useReducedMotion();

  useEffect(() => {
    const sync = () => setTheme(currentTheme());
    darkQuery.addEventListener('change', sync);
    return () => darkQuery.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0B0B10' : '#F8FAFC');
  }, [theme]);

  const toggle = useCallback(() => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
    const apply = () => {
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {
        // Storage can be unavailable (private mode); the choice then lasts for this page view.
      }
      setTheme(next);
    };
    // Cross-fade the palette swap where supported; reduced motion swaps instantly.
    if (!reduce && 'startViewTransition' in document) document.startViewTransition(apply);
    else apply();
  }, [reduce]);

  return { theme, toggle };
}
