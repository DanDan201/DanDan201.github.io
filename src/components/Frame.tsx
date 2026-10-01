import { motion, useReducedMotion } from 'motion/react';
import { useContext, useRef, type ReactNode } from 'react';
import { sectionIds, type SectionId } from '../content';
import { ActiveSectionContext } from '../hooks/useActiveSection';
import { lock, useSectionDepth } from '../motion';
import { Icon } from './Icon';

interface FrameProps {
  id: SectionId;
  icon: string;
  title: string;
  className?: string;
  children: ReactNode;
}

/** One full-height, scroll-snapped waypoint. Its numbered heading locks on while the section is active. */
export function Frame({ id, icon, title, className, children }: FrameProps) {
  const ref = useRef<HTMLElement>(null);
  const depth = useSectionDepth(ref);
  const reduce = useReducedMotion();
  const active = useContext(ActiveSectionContext) === id;
  return (
    <section className="frame" id={id} ref={ref} aria-labelledby={`${id}-title`}>
      <motion.div className={className ? `inner ${className}` : 'inner'} style={depth}>
        <h2 className="frame-title" id={`${id}-title`}>
          <span className="frame-index" aria-hidden="true">
            {String(sectionIds.indexOf(id) + 1).padStart(2, '0')}
          </span>
          <Icon name={icon} />
          {title}
          <motion.span
            className="brackets"
            variants={lock}
            custom={reduce}
            initial={false}
            animate={active ? 'locked' : 'idle'}
            aria-hidden="true"
          />
        </h2>
        {children}
      </motion.div>
    </section>
  );
}
