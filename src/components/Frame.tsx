import type { ReactNode } from 'react';
import type { SectionId } from '../content';
import { Icon } from './Icon';

interface FrameProps {
  id: SectionId;
  icon: string;
  title: string;
  className?: string;
  children: ReactNode;
}

/** One full-height, scroll-snapped section with its icon heading. */
export function Frame({ id, icon, title, className, children }: FrameProps) {
  return (
    <section className="frame" id={id}>
      <div className={className ? `inner ${className}` : 'inner'}>
        <h2>
          <Icon name={icon} /> {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
