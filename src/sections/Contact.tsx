import { motion } from 'motion/react';
import { Frame } from '../components/Frame';
import { Icon } from '../components/Icon';
import { contact } from '../content';
import { fade, useReveal } from '../motion';

export function Contact() {
  const reveal = useReveal('scroll');
  return (
    <Frame id="contact" icon="lu-mail" title="Contact" className="contact-inner">
      <motion.div className="row entry" variants={fade} {...reveal}>
        <div className="rail">
          <div>{contact.place}</div>
        </div>
        <div className="claim">
          <p>{contact.note}</p>
          <ul className="socials">
            {contact.socials.map(social => (
              <li key={social.label}>
                <a href={social.href} title={social.label}>
                  <Icon name={social.icon} className="icon-lg" />
                  <span className="sr-only">{social.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
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
