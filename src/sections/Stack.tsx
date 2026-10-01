import { Fragment } from 'react';
import { motion } from 'motion/react';
import { Frame } from '../components/Frame';
import { Icon } from '../components/Icon';
import { stack } from '../content';
import { scaleIn, staggerGroup, useReveal } from '../motion';

export function Stack() {
  const reveal = useReveal('scroll');
  return (
    <Frame id="stack" icon="lu-wrench" title="Stack">
      {stack.map(group => (
        <Fragment key={group.title}>
          <h3 className="sub">{group.title}</h3>
          <motion.ul className="chips" variants={staggerGroup(0.06)} {...reveal}>
            {group.items.map(item => (
              <motion.li key={item.name} variants={scaleIn}>
                <Icon name={item.icon} />
                <span>{item.name}</span>
              </motion.li>
            ))}
          </motion.ul>
        </Fragment>
      ))}
    </Frame>
  );
}
