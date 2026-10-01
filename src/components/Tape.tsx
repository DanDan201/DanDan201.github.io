import { motion, useReducedMotion, useSpring, useTransform, type MotionValue } from 'motion/react';
import { sections, type SectionId } from '../content';

/**
 * Section navigation drawn as a vertical altitude tape (desktop) plus a status bar (mobile).
 * `progress` reaches i / (n - 1) exactly when section i is at rest, so the pointer sits on a
 * label whenever its section is fully shown. With reduced motion the pointer and progress fill
 * do not follow scroll; they jump to the active section.
 */
export function Tape({ active, progress }: { active: SectionId; progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
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
