import { motion, useReducedMotion } from 'motion/react';
import { useContext, useRef, type ReactNode } from 'react';
import { sectionIds, type SectionId } from '../content';
import { ActiveSectionContext } from '../hooks/useActiveSection';
import { lock, useStage } from '../motion';
import { Icon } from './Icon';

interface FrameProps {
  id: SectionId;
  icon: string;
  title: string;
  className?: string;
  children: ReactNode;
}

/**
 * One section of the page. On the desktop stage the section is a tall slot whose stage pins to the
 * viewport and wipes in over the previous one; elsewhere it is an ordinary block. Its numbered
 * heading locks on while the section is active. Inactive stages sit hidden behind the wipe and fade,
 * so they are inert: no Tab stops, clicks or screen-reader content until the tape (or scrolling)
 * makes them active, the way an accessible slideshow treats its hidden slides.
 */
export function Frame({ id, icon, title, className, children }: FrameProps) {
  const ref = useRef<HTMLElement>(null);
  const index = sectionIds.indexOf(id);
  const stage = useStage(ref, index === 0 ? 'first' : index === sectionIds.length - 1 ? 'last' : 'middle');
  const reduce = useReducedMotion();
  const active = useContext(ActiveSectionContext) === id;
  return (
    <section className="frame" id={id} ref={ref} aria-labelledby={`${id}-title`} inert={stage.enabled && !active}>
      <motion.div className="stage" style={stage.style}>
        {stage.scan && <motion.span className="scan" style={stage.scan} aria-hidden="true" />}
        <div className={className ? `inner ${className}` : 'inner'}>
          <h2 className="frame-title" id={`${id}-title`}>
            <span className="frame-index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
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
        </div>
      </motion.div>
    </section>
  );
}
