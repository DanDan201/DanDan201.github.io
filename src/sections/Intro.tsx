import { motion } from 'motion/react';
import { intro } from '../content';
import { fade, slideFromLeft, staggerGroup, useReveal } from '../motion';

export function Intro() {
  const reveal = useReveal('mount');
  const languageNames = new Intl.ListFormat('en', { type: 'conjunction' }).format(intro.languages.map(language => language.name));
  return (
    <section className="frame" id="intro">
      <motion.div className="inner" variants={staggerGroup(0.12)} {...reveal}>
        <motion.h1 className="name" variants={fade}>
          Anh
          <br />
          Nguyen
        </motion.h1>
        <div className="mark-rule" aria-hidden="true" />
        <div className="row">
          <motion.div className="rail" variants={slideFromLeft}>
            {intro.facts.map(fact => (
              <div key={fact}>{fact}</div>
            ))}
            <div className="intro-languages">
              <span>Languages</span>
              <span className="language-list" aria-label={languageNames}>
                {intro.languages.map(language => (
                  <span key={language.flag} className="language">
                    <img src={`/assets/flags/${language.flag}.svg`} alt="" width="16" height="16" />
                    {language.name}
                  </span>
                ))}
              </span>
            </div>
          </motion.div>
          <motion.div className="claim" variants={fade}>
            <p className="lead">{intro.lead}</p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
