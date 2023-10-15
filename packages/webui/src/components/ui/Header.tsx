import useFeatureFlags from '@/hooks/useFeatureFlags';
import { tw } from '@/utils';

import DarkModeToggle from '../DarkModeToggle';

import ConnectionStatus from './ConnectionStatus';
import DebugToolbar from './DebugToolbar';
import FiltersAndActions from './FiltersAndActions';

export default function Header({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { enableThemeSwitcher } = useFeatureFlags();
  const isDebugMode = process.env.NODE_ENV === 'development';

  return (
    <header
      className={tw('p-default flex flex-row items-center', 'border-b border-primary shadow-lg', className)}
      {...props}
    >
      <span className="flex-0 mr-2">
        <span className="flex items-center py-2">
          <span className="mr-2">
            <ConnectionStatus />
          </span>
          <h1 className="font-extrabold text-xl uppercase mr-4 select-none">Envy</h1>
        </span>
      </span>
      <span className="flex-0 flex items-center ml-auto gap-2">
        {isDebugMode && <DebugToolbar />}
        {enableThemeSwitcher && <DarkModeToggle />}
        <FiltersAndActions />
      </span>
    </header>
  );
}
