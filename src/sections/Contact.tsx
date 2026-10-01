import { motion } from 'motion/react';
import { Frame } from '../components/Frame';
import { Icon } from '../components/Icon';
import { contact } from '../content';
import { fade, slideFromLeft, staggerGroup, useReveal } from '../motion';

export function Contact() {
  const reveal = useReveal('contact');
  return (
    <Frame id="contact" icon="lu-mail" title="Contact">
      <motion.div className="comms" variants={staggerGroup(0.07)} {...reveal}>
        <motion.p className="comms-place" variants={fade}>
          <Icon name="lu-map-pin" /> {contact.place}
        </motion.p>
        <motion.p className="comms-note" variants={fade}>
          {contact.note}
        </motion.p>
        <ul className="comms-links">
          {contact.socials.map(social => (
            <motion.li key={social.label} variants={slideFromLeft}>
              <a href={social.href}>
                <Icon name={social.icon} />
                {social.label}
              </a>
            </motion.li>
          ))}
        </ul>
      </motion.div>
      <footer className="footer">
        <blockquote className="closing-quote">
          <p>{contact.quote}</p>
        </blockquote>
        <p className="footer-meta">{contact.updated}</p>
      </footer>
    </Frame>
  );
}
