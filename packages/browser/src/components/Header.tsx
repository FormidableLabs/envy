import { tw } from '@/utils';

import ConnectionStatus from './ConnectionStatus';
import DebugToolbar from './DebugToolbar';
import FiltersAndActions from './FiltersAndActions';

export default function Header({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={tw(
        'text-slate-600',
        'p-default bg-slate-200 flex flex-row items-center',
        'border-b border-slate-600 shadow-lg',
        className,
      )}
      {...props}
    >
      <span className="flex-0 mr-2">
        <span className="flex items-center py-2">
          <span className="flex items-center justify-center mr-2 w-6 h-6">
            <ConnectionStatus />
          </span>
          <h1 className="font-extrabold text-xl uppercase mr-2 select-none ">Envy</h1>
        </span>
      </span>
      <span className="flex-0 flex items-center ml-auto gap-2">
        {/* TODO: only show this in dev mode (or debug mode?) */}
        <DebugToolbar />
        <FiltersAndActions />
      </span>
    </header>
  );
}
