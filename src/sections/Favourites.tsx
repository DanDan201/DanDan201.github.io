import { motion } from 'motion/react';
import { Frame } from '../components/Frame';
import { Icon } from '../components/Icon';
import { facets } from '../content';
import { drawX, fade, staggerGroup, useReveal } from '../motion';

export function Favourites() {
  const reveal = useReveal('scroll');
  return (
    <Frame id="favourites" icon="lu-sparkles" title="Favourites">
      <motion.dl className="readout" variants={staggerGroup(0.07)} {...reveal}>
        {facets.map(facet => (
          <motion.div key={facet.title} className="readout-row" variants={fade}>
            <dt>
              <Icon name={facet.icon} />
              {facet.title}
              <motion.span className="leader" variants={drawX} aria-hidden="true" />
            </dt>
            <dd>
              {'picks' in facet ? (
                <ul className="picks">
                  {facet.picks.map(pick => (
                    <li key={pick.name}>
                      <Icon name={pick.icon} className="pick-icon" />
                      {pick.name}
                    </li>
                  ))}
                </ul>
              ) : (
                facet.text
              )}
            </dd>
          </motion.div>
        ))}
      </motion.dl>
    </Frame>
  );
}
