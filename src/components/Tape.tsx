import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useEffect, useRef } from 'react';
import { sections, type SectionId } from '../content';

/**
 * Section navigation drawn as a vertical altitude tape (desktop) plus a status bar (mobile).
 * Scroll offset maps piecewise-linearly between section tops onto evenly spaced labels,
 * so the pointer rests exactly on a label whenever its section is snapped into view.
 * With reduced motion the pointer and progress fill do not follow scroll; they jump to the active section.
 */
export function Tape({ active }: { active: SectionId }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const tops = useRef<number[]>([]);

  useEffect(() => {
    const measure = () => {
      // The last sections can be shorter than the viewport on mobile; clamp so the end stays reachable.
      const max = document.documentElement.scrollHeight - window.innerHeight;
      tops.current = sections.map(({ id }) => {
        const top = (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + window.scrollY;
        return Math.min(top, max);
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const progress = useTransform(scrollY, y => {
    const stops = tops.current;
    for (let i = 1; i < stops.length; i++) {
      if (y < stops[i]) return (i - 1 + Math.max(0, y - stops[i - 1]) / (stops[i] - stops[i - 1])) / (stops.length - 1);
    }
    return stops.length > 1 ? 1 : 0;
  });
  const smooth = useSpring(progress, { stiffness: 400, damping: 40, restDelta: 0.0005 });
  const pointerY = useTransform(smooth, p => `${p * 100}%`);
  const activeIndex = sections.findIndex(section => section.id === active);
  const settled = activeIndex / (sections.length - 1);

  return (
    <>
      <nav className="tape" aria-label="Sections">
        <div className="tape-rail" aria-hidden="true">
          <motion.div className="tape-track" style={{ y: reduce ? `${settled * 100}%` : pointerY }}>
            <span className="tape-pointer" />
          </motion.div>
        </div>
        <ol>
          {sections.map(({ id, label }, index) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={id === active ? 'location' : undefined}>
                <span className="tape-index">{String(index + 1).padStart(2, '0')}</span>
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="status-bar" aria-hidden="true">
        <span className="status-label">
          <span className="tape-index">{String(activeIndex + 1).padStart(2, '0')}</span> {sections[activeIndex].label}
        </span>
        <span className="status-strip">
          <motion.span className="status-fill" style={{ scaleX: reduce ? settled : smooth }} />
          {sections.map(({ id }) => (
            <i key={id} />
          ))}
        </span>
      </div>
    </>
  );
}
