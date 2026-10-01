import { motion, useReducedMotion, useScroll } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Frame } from '../components/Frame';
import { Icon } from '../components/Icon';
import { degrees, jobs } from '../content';
import { fade, slideFromLeft, staggerGroup, useReveal } from '../motion';

export function Work() {
  const reveal = useReveal('scroll');
  const reduce = useReducedMotion();
  const logRef = useRef<HTMLDivElement>(null);
  // The track draws while the log rises into view and completes once the log's bottom is on screen.
  const { scrollYProgress } = useScroll({ target: logRef, offset: ['start 0.9', 'end end'] });
  const [lit, setLit] = useState(0);

  // A node lights once the drawn track reaches it. Counting from the current value as well as on change
  // covers a page that loads (or restores its scroll) with the log already behind the reader.
  useEffect(() => {
    const log = logRef.current;
    if (!log) return;
    let stops: number[] = [];
    const update = () => setLit(stops.filter(stop => stop <= scrollYProgress.get()).length);
    const measure = () => {
      const box = log.getBoundingClientRect();
      stops = [...log.querySelectorAll('.log-node')].map(node => {
        const rect = node.getBoundingClientRect();
        return (rect.top + rect.height / 2 - box.top) / box.height;
      });
      update();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(log);
    const unsubscribe = scrollYProgress.on('change', update);
    return () => {
      observer.disconnect();
      unsubscribe();
    };
  }, [scrollYProgress]);
  const litCount = reduce ? jobs.length : lit;

  return (
    <Frame id="work" icon="lu-briefcase" title="Work & education">
      <div className="work-grid">
        <div className="log" ref={logRef}>
          <motion.span className="log-track" aria-hidden="true" style={reduce ? undefined : { scaleY: scrollYProgress }} />
          <ol>
            {jobs.map((job, index) => (
              <motion.li
                key={job.company}
                className="log-entry"
                data-lit={index < litCount || undefined}
                variants={staggerGroup(0.07)}
                {...reveal}
              >
                <span className="log-node" aria-hidden="true" />
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
        </div>
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
