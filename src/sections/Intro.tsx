import { motion, useTransform } from 'motion/react';
import { useContext, useRef } from 'react';
import { intro } from '../content';
import { ActiveSectionContext } from '../hooks/useActiveSection';
import { drawX, fade, scaleIn, shutter, staggerGroup, useReveal, useStage } from '../motion';

/** Pitch ladder rungs above the horizon, in degrees. */
const rungs = [10, 5];

export function Intro() {
  const ref = useRef<HTMLElement>(null);
  const reveal = useReveal('intro');
  const stage = useStage(ref, 'first');
  const active = useContext(ActiveSectionContext) === 'intro';
  // Leaving the hero is the page's one big move: while the stage hands over to Work, the horizon
  // banks and sinks and the name climbs away.
  const bank = useTransform(stage.leaving, [0, 1], [0, -8]);
  const sink = useTransform(stage.leaving, [0, 1], ['0vh', '12vh']);
  const climb = useTransform(stage.leaving, [0, 1], ['0vh', '-16vh']);
  const nameOpacity = useTransform(stage.leaving, [0, 0.75], [1, 0]);
  const drift = useTransform(stage.leaving, [0, 1], ['0vh', '-6vh']);

  return (
    <section className="frame hero" id="intro" ref={ref} aria-labelledby="intro-title" inert={stage.enabled && !active}>
      <motion.div className="stage" style={stage.style}>
        <motion.div className="inner hero-grid" variants={staggerGroup(0.09)} {...reveal}>
          <motion.div
            className="horizon"
            aria-hidden="true"
            variants={staggerGroup(0.07)}
            style={stage.enabled ? { rotate: bank, y: sink } : undefined}
          >
            <motion.span className="horizon-line horizon-line-left" variants={drawX} />
            <motion.span className="horizon-line horizon-line-right" variants={drawX} />
            <motion.svg className="fpm" viewBox="0 0 56 22" variants={scaleIn}>
              <circle cx="28" cy="13" r="6" />
              <path d="M2 13h20M34 13h20M28 7V1" />
            </motion.svg>
            {rungs.map(pitch => (
              <motion.span key={pitch} className="rung" data-pitch={pitch} variants={fade}>
                <span>{pitch}</span>
                <i />
                <i />
                <span>{pitch}</span>
              </motion.span>
            ))}
          </motion.div>
          <motion.h1
            className="name"
            id="intro-title"
            variants={staggerGroup(0.09)}
            style={stage.enabled ? { y: climb, opacity: nameOpacity } : undefined}
          >
            {['Anh', 'Nguyen'].map(line => (
              <span key={line} className="name-line">
                {line}{' '}
                <motion.span className="name-shutter" variants={shutter} aria-hidden="true" />
              </span>
            ))}
          </motion.h1>
          <motion.p className="lead" variants={fade} style={stage.enabled ? { y: drift } : undefined}>
            {intro.lead}
          </motion.p>
          <motion.dl className="hero-data" variants={fade} style={stage.enabled ? { y: drift } : undefined}>
            {intro.facts.map(fact => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
            <div>
              <dt>Languages</dt>
              <dd className="language-list">
                {intro.languages.map(language => (
                  <span key={language.flag} className="language">
                    <img src={`/assets/flags/${language.flag}.svg`} alt="" width="16" height="16" />
                    {language.name}
                  </span>
                ))}
              </dd>
            </div>
          </motion.dl>
        </motion.div>
      </motion.div>
    </section>
  );
}
