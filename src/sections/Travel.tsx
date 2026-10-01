import { Fragment } from 'react';
import { motion } from 'motion/react';
import { Frame } from '../components/Frame';
import { Icon } from '../components/Icon';
import { travel } from '../content';
import { scaleIn, staggerGroup, useReveal } from '../motion';

export function Travel() {
  const reveal = useReveal('scroll');
  return (
    <Frame id="travel" icon="lu-globe" title="Travel">
      {travel.map(region => (
        <Fragment key={region.title}>
          <h3 className="sub">
            <Icon name={region.icon} /> {region.title}
          </h3>
          <motion.ul className="places" variants={staggerGroup(0.04)} {...reveal}>
            {region.places.map(place => (
              <motion.li key={place.flag} variants={scaleIn}>
                <img src={`/assets/flags/${place.flag}.svg`} alt="" width="20" height="20" loading="lazy" />
                <span>{place.name}</span>
              </motion.li>
            ))}
          </motion.ul>
        </Fragment>
      ))}
    </Frame>
  );
}
