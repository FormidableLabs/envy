import useFeatureFlags from '@/hooks/useFeatureFlags';

import DarkModeToggle from '../DarkModeToggle';

import DebugToolbar from './DebugToolbar';
import FiltersAndActions from './FiltersAndActions';
import Logo from './Logo';
import SourceAndSystemFilter from './SourceAndSystemFilter';

export default function Header() {
  const { enableThemeSwitcher } = useFeatureFlags();
  const isDebugMode = process.env.NODE_ENV !== 'production';

  return (
    <header className="px-3 py-2 border-b border-manatee-400">
      <div className="flex justify-between">
        <div className="flex items-center gap-3">
          <div>
            <Logo />
          </div>
          <div className="text-[1.5rem] font-bold mr-4">ENVY</div>
        </div>
        <div className="flex items-center gap-3">
          <FiltersAndActions />
          <SourceAndSystemFilter />
          {enableThemeSwitcher && <DarkModeToggle />}
          {isDebugMode && <DebugToolbar />}
        </div>
      </div>
    </header>
  );
}
