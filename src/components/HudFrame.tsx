import { motion, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useStageMode } from '../motion';

const ALTITUDE_RANGE_FT = 30_000;
const ALTITUDE_STEP_FT = 100;
const HUD_MAJOR_STEP_FT = 1_000;

function formatHudScaleLabel(feet: number) {
  return `${String(Math.max(0, Math.round(feet / HUD_MAJOR_STEP_FT))).padStart(2, '0')},0`;
}

/** Desktop HUD furniture: viewport brackets and a simulated F-16-style altitude tape. */
export function HudFrame({ progress }: { progress: MotionValue<number> }) {
  const animate = useStageMode();
  const altitudeRef = useRef<HTMLSpanElement>(null);
  const upperScaleRef = useRef<HTMLSpanElement>(null);
  const lowerScaleRef = useRef<HTMLSpanElement>(null);
  const y = useTransform(progress, [0, 1], ['0%', '-50%']);

  useEffect(() => {
    const updateAltitude = (progressValue: number) => {
      const bounded = Math.max(0, Math.min(1, progressValue));
      const feet = Math.round((1 - bounded) * (ALTITUDE_RANGE_FT / ALTITUDE_STEP_FT)) * ALTITUDE_STEP_FT;
      let lower = Math.floor(feet / HUD_MAJOR_STEP_FT);
      let upper = Math.ceil(feet / HUD_MAJOR_STEP_FT);
      if (upper === lower) {
        if (feet >= ALTITUDE_RANGE_FT) lower = Math.max(0, upper - 1);
        else upper = Math.min(ALTITUDE_RANGE_FT / HUD_MAJOR_STEP_FT, upper + 1);
      }
      if (altitudeRef.current) altitudeRef.current.textContent = feet.toLocaleString('en-US');
      if (upperScaleRef.current) upperScaleRef.current.textContent = formatHudScaleLabel(upper * HUD_MAJOR_STEP_FT);
      if (lowerScaleRef.current) lowerScaleRef.current.textContent = formatHudScaleLabel(lower * HUD_MAJOR_STEP_FT);
    };
    updateAltitude(progress.get());
    return progress.on('change', updateAltitude);
  }, [progress]);

  return (
    <div className="hud" aria-hidden="true">
      <span className="brackets hud-corners" />
      <div className="hud-scale">
        <span className="hud-scale-rail">
          <motion.span className="hud-scale-strip" style={animate ? { y } : undefined} />
        </span>
        <span className="hud-scale-label hud-scale-label-upper" ref={upperScaleRef}>30,0</span>
        <span className="hud-scale-label hud-scale-label-lower" ref={lowerScaleRef}>29,0</span>
        <div className="hud-altimeter">
          <span className="hud-altimeter-value" ref={altitudeRef}>30,000</span>
        </div>
      </div>
    </div>
  );
}
