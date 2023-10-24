import useFeatureFlags from '@/hooks/useFeatureFlags';

import DarkModeToggle from '../DarkModeToggle';

import ConnectionStatus from './ConnectionStatus';
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
          <div className="hidden md:block">
            <ConnectionStatus />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isDebugMode && <DebugToolbar />}
          <FiltersAndActions />
          {enableThemeSwitcher && <DarkModeToggle />}
        </div>
      </div>
    </header>
  );
}
