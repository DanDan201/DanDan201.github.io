import { Fragment } from 'react';
import { motion } from 'motion/react';
import { Frame } from '../components/Frame';
import { Icon } from '../components/Icon';
import { facets } from '../content';
import { fade, staggerGroup, useReveal } from '../motion';

export function Favourites() {
  const reveal = useReveal('scroll');
  return (
    <Frame id="favourites" icon="lu-sparkles" title="Favourites">
      <motion.dl className="facets" variants={staggerGroup(0.05)} {...reveal}>
        {facets.map(facet => (
          <Fragment key={facet.title}>
            <motion.dt variants={fade}>
              <Icon name={facet.icon} /> {facet.title}
            </motion.dt>
            <motion.dd variants={fade}>
              {'picks' in facet ? (
                <ul className="picks">
                  {facet.picks.map(pick => (
                    <li key={pick.name}>
                      <Icon name={pick.icon} className="pick-icon" />
                      <span>{pick.name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                facet.text
              )}
            </motion.dd>
          </Fragment>
        ))}
      </motion.dl>
    </Frame>
  );
}
