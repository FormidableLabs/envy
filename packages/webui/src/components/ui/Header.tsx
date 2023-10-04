import useApplication from '@/hooks/useApplication';
import { tw } from '@/utils';

import ConnectionStatus from './ConnectionStatus';
import DebugToolbar from './DebugToolbar';
import FiltersAndActions from './FiltersAndActions';

export default function Header({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  const { activeConnections } = useApplication();

  const isDebugMode = process.env.NODE_ENV === 'development';
  const connectionTypeLabel = activeConnections.length === 1 ? 'source' : 'sources';

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
          <span className="mr-2">
            <ConnectionStatus />
          </span>
          <h1 className="font-extrabold text-xl uppercase mr-4 select-none">Envy</h1>
          <div className="flex flex-row text-slate-400 text-sm font-bold">
            <div title={activeConnections.map(([serviceName]) => serviceName).join(', ')}>
              {activeConnections.length} {connectionTypeLabel} connected
            </div>
          </div>
        </span>
      </span>
      <span className="flex-0 flex items-center ml-auto gap-2">
        {isDebugMode && <DebugToolbar />}
        <FiltersAndActions />
      </span>
    </header>
  );
}
