import ConnectionDetail from '@/components/ConnectionDetail';
import ConnectionList from '@/components/ConnectionList';
import useApplication from '@/hooks/useApplication';

export default function MainDisplay() {
  const { connectionId } = useApplication();

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-400 overflow-hidden">
      <ConnectionList className="flex-[2]" />
      {connectionId && <ConnectionDetail className="flex-[3]" />}
    </div>
  );
}
