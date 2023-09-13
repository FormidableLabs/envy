import TraceDetail from '@/components/TraceDetail';
import TraceList from '@/components/TraceList';
import useApplication from '@/hooks/useApplication';

export default function MainDisplay() {
  const { traceId } = useApplication();

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-400 overflow-hidden">
      <TraceList className="flex-[2]" />
      {traceId && <TraceDetail className="flex-[3]" />}
    </div>
  );
}
