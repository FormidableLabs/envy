import { Allotment } from 'allotment';
import { Toaster } from 'react-hot-toast';

import TraceDetail from '@/components/ui/TraceDetail';
import TraceList from '@/components/ui/TraceList';
import useApplication from '@/hooks/useApplication';

import 'allotment/dist/style.css';

export default function MainDisplay() {
  const { selectedTraceId } = useApplication();

  return (
    <div className="h-full">
      <Allotment>
        <Allotment.Pane>
          <TraceList />
        </Allotment.Pane>
        {selectedTraceId && (
          <Allotment.Pane preferredSize="66%">
            <TraceDetail />
          </Allotment.Pane>
        )}
      </Allotment>
      <Toaster />
    </div>
  );
}
