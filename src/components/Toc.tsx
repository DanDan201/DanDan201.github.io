import { motion } from 'motion/react';
import { sections, type SectionId } from '../content';
import { enter } from '../motion';

/** Desktop section index; one shared indicator slides to the section in view. */
export function Toc({ active }: { active: SectionId }) {
  return (
    <nav className="toc" aria-label="Sections">
      <ol>
        {sections.map(({ id, label }) => (
          <li key={id}>
            <a href={`#${id}`} aria-current={id === active ? 'true' : undefined}>
              {id === active && (
                <motion.span className="toc-indicator" layoutId="toc-indicator" transition={enter} aria-hidden="true" />
              )}
              {label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
