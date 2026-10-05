import { motion, useReducedMotion, useTransform, type MotionValue } from 'motion/react';
import { useEffect, useRef } from 'react';
import { sectionIds } from '../content';

const ALTITUDE_RANGE_FT = 30_000;
const ALTITUDE_STEP_FT = 100;
const HUD_MAJOR_STEP_FT = 1_000;
// Matches --hud-major-spacing in styles.css.
const HUD_MAJOR_TICK_SPACING_REM = 4.375;
const HUD_MAJOR_TICK_COUNT = ALTITUDE_RANGE_FT / HUD_MAJOR_STEP_FT;
const HUD_WAYPOINT_INTERVALS = Math.max(1, sectionIds.length - 1);

function boundProgress(progress: number) {
  return Math.max(0, Math.min(1, progress));
}

function altitudeAtProgress(progress: number) {
  return Math.round((1 - boundProgress(progress)) * (ALTITUDE_RANGE_FT / ALTITUDE_STEP_FT)) * ALTITUDE_STEP_FT;
}

function lowerMajorTick(feet: number) {
  const lower = Math.floor(feet / HUD_MAJOR_STEP_FT);
  return lower === Math.ceil(feet / HUD_MAJOR_STEP_FT) ? lower - 1 : lower;
}

function upperMajorTick(feet: number) {
  const upper = Math.ceil(feet / HUD_MAJOR_STEP_FT);
  return upper === Math.floor(feet / HUD_MAJOR_STEP_FT) ? upper + 1 : upper;
}

function formatHudScaleLabel(thousands: number) {
  const magnitude = String(Math.abs(thousands)).padStart(2, '0');
  return `${thousands < 0 ? '-' : ''}${magnitude},0`;
}

/** Desktop HUD furniture: viewport brackets and a simulated F-16-style altitude tape. */
export function HudFrame({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const altitudeRef = useRef<HTMLSpanElement>(null);
  const upperScaleRef = useRef<HTMLSpanElement>(null);
  const lowerScaleRef = useRef<HTMLSpanElement>(null);
  const hudProgress = useTransform(progress, value => {
    const bounded = boundProgress(value);
    return reduce ? Math.round(bounded * HUD_WAYPOINT_INTERVALS) / HUD_WAYPOINT_INTERVALS : bounded;
  });
  const y = useTransform(hudProgress, value => {
    const majorIntervals = HUD_MAJOR_TICK_COUNT - altitudeAtProgress(value) / HUD_MAJOR_STEP_FT;
    return `${-majorIntervals * HUD_MAJOR_TICK_SPACING_REM}rem`;
  });
  const upperY = useTransform(hudProgress, value => {
    const feet = altitudeAtProgress(value);
    return `${-((upperMajorTick(feet) * HUD_MAJOR_STEP_FT - feet) / HUD_MAJOR_STEP_FT) * HUD_MAJOR_TICK_SPACING_REM}rem`;
  });
  const lowerY = useTransform(hudProgress, value => {
    const feet = altitudeAtProgress(value);
    return `${((feet - lowerMajorTick(feet) * HUD_MAJOR_STEP_FT) / HUD_MAJOR_STEP_FT) * HUD_MAJOR_TICK_SPACING_REM}rem`;
  });

  useEffect(() => {
    const updateAltitude = (progressValue: number) => {
      const feet = altitudeAtProgress(progressValue);
      if (altitudeRef.current) altitudeRef.current.textContent = feet.toLocaleString('en-US');
      if (upperScaleRef.current) upperScaleRef.current.textContent = formatHudScaleLabel(upperMajorTick(feet));
      if (lowerScaleRef.current) lowerScaleRef.current.textContent = formatHudScaleLabel(lowerMajorTick(feet));
    };
    updateAltitude(hudProgress.get());
    return hudProgress.on('change', updateAltitude);
  }, [hudProgress]);

  return (
    <div className="hud" aria-hidden="true">
      <span className="brackets hud-corners" />
      <div className="hud-scale">
        <span className="hud-scale-rail">
          <motion.span className="hud-scale-strip" style={{ y }} />
        </span>
        <motion.span className="hud-scale-label" style={{ y: upperY }} ref={upperScaleRef}>31,0</motion.span>
        <motion.span className="hud-scale-label" style={{ y: lowerY }} ref={lowerScaleRef}>29,0</motion.span>
        <div className="hud-altimeter">
          <span className="hud-altimeter-value" ref={altitudeRef}>30,000</span>
        </div>
      </div>
    </div>
  );
}
