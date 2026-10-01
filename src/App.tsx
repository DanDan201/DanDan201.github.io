import { MotionConfig } from 'motion/react';
import { HomeMark } from './components/HomeMark';
import { ThemeToggle } from './components/ThemeToggle';
import { Toc } from './components/Toc';
import { sectionIds } from './content';
import { useActiveSection } from './hooks/useActiveSection';
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
      <HomeMark />
      <ThemeToggle />
      <Toc active={active} />
      <div className="frames">
        <Intro />
        <Work />
        <Stack />
        <Favourites />
        <Travel />
        <Contact />
      </div>
    </MotionConfig>
  );
}
