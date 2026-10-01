import { MotionConfig } from 'motion/react';
import { HomeMark } from './components/HomeMark';
import { HudFrame } from './components/HudFrame';
import { Tape } from './components/Tape';
import { ThemeToggle } from './components/ThemeToggle';
import { sectionIds } from './content';
import { ActiveSectionContext, RevealedSectionsContext, useSectionTracking } from './hooks/useActiveSection';
import { Contact } from './sections/Contact';
import { Favourites } from './sections/Favourites';
import { Intro } from './sections/Intro';
import { Stack } from './sections/Stack';
import { Travel } from './sections/Travel';
import { Work } from './sections/Work';

export function App() {
  const { active, revealed, progress } = useSectionTracking(sectionIds);
  return (
    <MotionConfig reducedMotion="user">
      <ActiveSectionContext value={active}>
        <RevealedSectionsContext value={revealed}>
          <HudFrame />
          <HomeMark />
          <ThemeToggle />
          <Tape active={active} progress={progress} />
          <main className="frames">
            <Intro />
            <Work />
            <Stack />
            <Favourites />
            <Travel />
            <Contact />
          </main>
        </RevealedSectionsContext>
      </ActiveSectionContext>
    </MotionConfig>
  );
}
