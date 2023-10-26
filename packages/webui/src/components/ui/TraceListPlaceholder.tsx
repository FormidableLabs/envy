import { Wifi, Zap, ZapOff } from 'lucide-react';

import useApplication from '@/hooks/useApplication';

export default function TraceListPlaceholder() {
  const { connected, connecting } = useApplication();

  const [Icon, message] = connected
    ? [Wifi, `Listening for traces...`]
    : connecting
    ? [Zap, 'Connecting...']
    : [ZapOff, 'Unable to connect'];

  return (
    <div
      data-test-id="trace-list-placeholder"
      className="flex flex-none h-full justify-center items-center text-3xl text-neutral"
    >
      <Icon className="translate-y-[0.05em] w-8 h-8 mr-2" /> <span>{message}</span>
    </div>
  );
}
