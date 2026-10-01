import { MotionConfig } from 'motion/react';
import { HomeMark } from './components/HomeMark';
import { HudFrame } from './components/HudFrame';
import { Tape } from './components/Tape';
import { ThemeToggle } from './components/ThemeToggle';
import { sectionIds } from './content';
import { ActiveSectionContext, useActiveSection } from './hooks/useActiveSection';
import { Contact } from './sections/Contact';
import { Favourites } from './sections/Favourites';
import { Intro } from './sections/Intro';
import { Stack } from './sections/Stack';
import { Travel } from './sections/Travel';
import { Work } from './sections/Work';

export function App() {
  const active = useActiveSection(sectionIds);
  return (
    <MotionConfig reducedMotion="user">
      <ActiveSectionContext value={active}>
        <HudFrame />
        <HomeMark />
        <ThemeToggle />
        <Tape active={active} />
        <main className="frames">
          <Intro />
          <Work />
          <Stack />
          <Favourites />
          <Travel />
          <Contact />
        </main>
      </ActiveSectionContext>
    </MotionConfig>
  );
}
