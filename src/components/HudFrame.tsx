import { motion, useScroll, useTransform } from 'motion/react';
import { useStageMode } from '../motion';

/** Desktop HUD furniture: viewport corner brackets and a tick scale that slides as the page scrolls. */
export function HudFrame() {
  const animate = useStageMode();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  return (
    <div className="hud" aria-hidden="true">
      <span className="brackets hud-corners" />
      <div className="hud-scale">
        <motion.span className="hud-scale-strip" style={animate ? { y } : undefined} />
      </div>
    </div>
  );
}
