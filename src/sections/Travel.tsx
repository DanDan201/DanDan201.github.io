import { Fragment } from 'react';
import { motion } from 'motion/react';
import { Frame } from '../components/Frame';
import { Icon } from '../components/Icon';
import { travel } from '../content';
import { flap, scaleIn, staggerGroup, useReveal } from '../motion';

export function Travel() {
  const reveal = useReveal('travel');
  return (
    <Frame id="travel" icon="lu-globe" title="Travel">
      <div className="travel-grid">
        <div className="visited">
          {travel.visited.map(region => (
            <Fragment key={region.title}>
              <h3 className="sub">
                <Icon name={region.icon} /> {region.title}
              </h3>
              <motion.ul className="places" variants={staggerGroup(0.06)} {...reveal}>
                {region.places.map(place => (
                  <motion.li key={place.flag} variants={scaleIn}>
                    <img src={`/assets/flags/${place.flag}.svg`} alt="" width="20" height="20" loading="lazy" />
                    <span className="place-code" aria-hidden="true">
                      {place.flag.toUpperCase()}
                    </span>
                    {place.name}
                  </motion.li>
                ))}
              </motion.ul>
            </Fragment>
          ))}
        </div>
        <div className="board">
          <h3 className="sub">
            <Icon name={travel.next.icon} /> {travel.next.title}
          </h3>
          <motion.ol className="board-rows" variants={staggerGroup(0.07)} {...reveal}>
            {travel.next.places.map(place => (
              <motion.li key={place.flag} className="board-row" variants={flap}>
                <img src={`/assets/flags/${place.flag}.svg`} alt="" width="20" height="20" loading="lazy" />
                <span className="place-code" aria-hidden="true">
                  {place.flag.toUpperCase()}
                </span>
                <span className="sr-only">{place.name}</span>
                {/* Split-flap cells, one per character; the visually hidden name above is what gets read out. */}
                <span className="cells" aria-hidden="true">
                  {[...place.name.toUpperCase()].map((char, index) => (
                    <span key={index}>{char}</span>
                  ))}
                </span>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </Frame>
  );
}
