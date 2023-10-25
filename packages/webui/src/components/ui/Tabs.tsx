import useApplication from '@/hooks/useApplication';
import { tw } from '@/utils';

export function TabList({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-secondary border-b border-primary">
      <ul className="flex flex-wrap text-sm gap-1">{children}</ul>
    </div>
  );
}

export function TabListItem({ id, title }: { id: string; title: string }) {
  const { selectedTab, setSelectedTab } = useApplication();

  const className = tw(
    'inline-block px-4 py-3 uppercase font-semibold cursor-pointer',
    'border border-b-0',
    selectedTab === id ? 'border-green-400 bg-green-100' : 'border-primary bg-primary',
  );

  return (
    <li>
      <a
        href={`#${id}`}
        className={className}
        onClick={() => {
          setSelectedTab(id);
        }}
      >
        {title}
      </a>
    </li>
  );
}

export function TabContent({ id, children }: { id: string; children: React.ReactNode }) {
  const { selectedTab } = useApplication();
  return <div className={selectedTab === id ? 'h-full' : 'hidden'}>{children}</div>;
}
