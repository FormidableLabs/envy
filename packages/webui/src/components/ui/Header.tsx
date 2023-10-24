import useFeatureFlags from '@/hooks/useFeatureFlags';

import DarkModeToggle from '../DarkModeToggle';

import DebugToolbar from './DebugToolbar';
import FiltersAndActions from './FiltersAndActions';
import Logo from './Logo';

export default function Header() {
  const { enableThemeSwitcher } = useFeatureFlags();
  const isDebugMode = process.env.NODE_ENV !== 'production';

  return (
    <header className="shadow p-3 bg-secondary">
      <div className="flex justify-between">
        <div className="flex items-center gap-2">
          <div>
            <Logo />
          </div>
          <div className="text-xl font-extrabold mr-4">ENVY</div>
        </div>
        <div className="flex items-center gap-2">
          <FiltersAndActions />
          {enableThemeSwitcher && <DarkModeToggle />}
          {isDebugMode && <DebugToolbar />}
        </div>
      </div>
    </header>
  );
}
