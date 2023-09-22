import { HiStatusOffline, HiStatusOnline } from 'react-icons/hi';

import { Loading } from '@/components';
import useApplication from '@/hooks/useApplication';

export default function ConnectionStatus() {
  const { connecting, connected } = useApplication();

  return (
    <>
      {connecting ? (
        <Loading size={4} />
      ) : connected ? (
        <HiStatusOnline className="w-full h-full text-green-600" />
      ) : (
        <HiStatusOffline className="w-full h-full text-red-600" />
      )}
    </>
  );
}
