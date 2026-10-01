import { motion } from 'motion/react';
import { Frame } from '../components/Frame';
import { Icon } from '../components/Icon';
import { degrees, jobs } from '../content';
import { fade, slideFromLeft, staggerGroup, useReveal } from '../motion';

export function Work() {
  const reveal = useReveal('scroll');
  return (
    <Frame id="work" icon="lu-briefcase" title="Work & education">
      {jobs.map(job => (
        <motion.div key={job.company} className="row entry" variants={staggerGroup(0.08)} {...reveal}>
          <motion.div className="rail" variants={slideFromLeft}>
            <img src={`/assets/logos/${job.logo}`} alt="" className={`mark ${job.logoClass}`} />
            <div>{job.company}</div>
            <div>{job.place}</div>
            <div>{job.period}</div>
          </motion.div>
          <motion.div className="claim" variants={fade}>
            <h3>{job.role}</h3>
            <p>{job.summary}</p>
          </motion.div>
        </motion.div>
      ))}
      <div className="education">
        <h3 className="sub">
          <Icon name="lu-graduation-cap" /> Education
        </h3>
        <motion.ul className="degrees" variants={staggerGroup(0.06)} {...reveal}>
          {degrees.map(degree => (
            <motion.li key={degree.title} className="degree-with-mark" variants={slideFromLeft}>
              <img
                src={`/assets/logos/${degree.logo}`}
                alt=""
                className={degree.wide ? 'education-mark education-mark-wide' : 'education-mark'}
              />
              <span>
                <strong>{degree.title}</strong> — {degree.detail}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </Frame>
  );
}
