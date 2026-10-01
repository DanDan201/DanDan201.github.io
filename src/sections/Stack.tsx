import { motion } from 'motion/react';
import { Frame } from '../components/Frame';
import { Icon } from '../components/Icon';
import { stack } from '../content';
import { fade, lockOnView, scaleIn, staggerGroup, useReveal } from '../motion';

export function Stack() {
  const reveal = useReveal('scroll');
  return (
    <Frame id="stack" icon="lu-wrench" title="Stack">
      <motion.div className="panel" variants={staggerGroup(0.09)} {...reveal}>
        {stack.map(group => (
          <motion.div
            key={group.title}
            className="module"
            data-size={group.items.length > 5 ? 'wide' : 'narrow'}
            variants={staggerGroup(0.06)}
          >
            <motion.span className="brackets" variants={lockOnView} aria-hidden="true" />
            <motion.h3 variants={fade}>{group.title}</motion.h3>
            <ul className="chips">
              {group.items.map(item => (
                <motion.li key={item.name} variants={scaleIn}>
                  <Icon name={item.icon} />
                  {item.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </Frame>
  );
}
