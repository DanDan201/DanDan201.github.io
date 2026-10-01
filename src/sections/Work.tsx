import { motion } from 'motion/react';
import { Frame } from '../components/Frame';
import { Icon } from '../components/Icon';
import { degrees, jobs } from '../content';
import { drawY, fade, nodeLight, slideFromLeft, staggerGroup, useReveal } from '../motion';

export function Work() {
  const reveal = useReveal('work');
  return (
    <Frame id="work" icon="lu-briefcase" title="Work & education">
      <div className="work-grid">
        {/* The track draws first; each entry follows, its node lighting as the line reaches it. */}
        <motion.div className="log" variants={staggerGroup(0.12)} {...reveal}>
          <motion.span className="log-track" variants={drawY} aria-hidden="true" />
          <ol>
            {jobs.map(job => (
              <motion.li key={job.company} className="log-entry" variants={staggerGroup(0.07)}>
                <motion.span className="log-node" variants={nodeLight} aria-hidden="true" />
                <motion.p className="log-when" variants={slideFromLeft}>
                  {job.start}
                  <span className="period-rule" aria-hidden="true" />
                  <span className="sr-only"> to </span>
                  {job.end}
                </motion.p>
                <motion.div className="log-body" variants={fade}>
                  <p className="log-org">
                    <img src={`/assets/logos/${job.logo}`} alt="" className={job.wide ? 'mark mark-wide' : 'mark'} />
                    <span>{job.company}</span>
                    <span>{job.place}</span>
                  </p>
                  <h3>{job.role}</h3>
                  <p>{job.summary}</p>
                </motion.div>
              </motion.li>
            ))}
          </ol>
        </motion.div>
        <div className="education">
          <h3 className="sub">
            <Icon name="lu-graduation-cap" /> Education
          </h3>
          <motion.ol className="degrees" variants={staggerGroup(0.07)} {...reveal}>
            {degrees.map(degree => (
              <motion.li key={degree.title} className="degree" variants={slideFromLeft}>
                <img src={`/assets/logos/${degree.logo}`} alt="" className={degree.wide ? 'degree-logo degree-logo-wide' : 'degree-logo'} />
                <span className="degree-when">
                  {degree.start}
                  <span className="period-rule" aria-hidden="true" />
                  <span className="sr-only"> to </span>
                  {degree.end}
                </span>
                <span className="degree-what">
                  <strong>{degree.title}</strong>
                  {degree.school && <span>{degree.school}</span>}
                </span>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </Frame>
  );
}
