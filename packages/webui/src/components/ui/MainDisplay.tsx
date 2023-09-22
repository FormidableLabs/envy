import TraceDetail from '@/components/ui/TraceDetail';
import TraceList from '@/components/ui/TraceList';
import useApplication from '@/hooks/useApplication';

export default function MainDisplay() {
  const { selectedTraceId: traceId } = useApplication();

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-400 overflow-hidden">
      <TraceList className="flex-[2]" />
      {traceId && <TraceDetail className="flex-[3]" />}
    </div>
  );
}
