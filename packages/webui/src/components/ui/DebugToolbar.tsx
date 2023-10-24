import { Bug } from 'lucide-react';

import { Menu } from '@/components';
import useApplication from '@/hooks/useApplication';
import mockData from '@/testing/mockTraces';

import { MenuItem } from '../Menu';

export default function DebugToolbar() {
  const { collector, traces } = useApplication();

  const debugOptions: MenuItem[] = [
    {
      label: 'Mock data',
      description: 'Inject mock traces',
      callback: () => {
        for (const trace of mockData) {
          collector?.addEvent(trace);
        }
      },
    },
    {
      label: 'Print traces',
      description: 'Output traces to the console',
      callback: () => {
        // eslint-disable-next-line no-console
        console.log('Traces:', [...traces.values()]);
      },
    },
  ];

  return <Menu data-test-id="debug-menu" Icon={Bug} items={debugOptions} />;
}
