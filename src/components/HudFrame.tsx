import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useStageMode } from '../motion';

const ALTITUDE_RANGE_FT = 30_000;
const ALTITUDE_STEP_FT = 100;
/** Desktop HUD furniture: viewport brackets, a simulated altitude readout, and a scrolling tick scale. */
export function HudFrame({ progress }: { progress: MotionValue<number> }) {
  const animate = useStageMode();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const altitudeRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const updateAltitude = (progress: number) => {
      const bounded = Math.max(0, Math.min(1, progress));
      const feet = Math.round((1 - bounded) * (ALTITUDE_RANGE_FT / ALTITUDE_STEP_FT)) * ALTITUDE_STEP_FT;
      if (altitudeRef.current) altitudeRef.current.textContent = feet.toLocaleString('en-US');
    };
    updateAltitude(progress.get());
    return progress.on('change', updateAltitude);
  }, [progress]);
  return (
    <div className="hud" aria-hidden="true">
      <span className="brackets hud-corners" />
      <div className="hud-altimeter">
        <span className="hud-altimeter-label">SIM ALT</span>
        <span className="hud-altimeter-value" ref={altitudeRef}>30,000</span>
        <span className="hud-altimeter-unit">FT</span>
      </div>
      <div className="hud-scale">
        <motion.span className="hud-scale-strip" style={animate ? { y } : undefined} />
      </div>
    </div>
  );
}
