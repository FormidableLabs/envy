import { HiStatusOffline, HiStatusOnline } from 'react-icons/hi';

import { Loading } from '@/components';
import useApplication from '@/hooks/useApplication';

export default function ConnectionStatus() {
  const { connecting, connected, connections } = useApplication();

  if (connecting) {
    return <Loading size={4} className="flex items-center" />;
  }

  const containerClasses = 'flex items-center mt-1 text-gray-600 text-xs uppercase';

  if (connected) {
    return (
      <div className={containerClasses}>
        <HiStatusOnline className="text-green-600" />
        <div className="ml-2">{`${connections.length} Source${connections.length === 1 ? '' : 's'} Connected`}</div>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <HiStatusOffline className="text-red-600" />
      <div className="ml-2">Not connected</div>
    </div>
  );
}
