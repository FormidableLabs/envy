import useApplication from '@/hooks/useApplication';
import { tw } from '@/utils';

export function TabList({
  children,
  ...props
}: { children: React.ReactNode } & React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className="flex flex-wrap text-sm gap-1" {...props}>
      {children}
    </ul>
  );
}

export function TabListItem({
  id,
  title,
  disabled = false,
  ...props
}: { id: string; title: string; disabled?: boolean } & React.HTMLAttributes<HTMLAnchorElement>) {
  const { selectedTab, setSelectedTab } = useApplication();

  const href = disabled ? undefined : `#${id}`;

  const className = tw(
    'inline-block px-2 py-1 rounded-[0.25rem] font-bold text-xs uppercase',
    disabled
      ? 'text-gray-400 cursor-not-allowed'
      : selectedTab === id
      ? 'bg-green-400 text-green-900'
      : 'text-gray-800 hover:bg-green-200 hover:text-green-900 focus:bg-green-200 focus:text-green-900 active:bg-green-500 active:text-green-950',
  );

  return (
    <li>
      <a
        {...props}
        role="link"
        aria-disabled={disabled}
        href={href}
        className={className}
        onClick={e => {
          if (disabled) {
            e.preventDefault();
            return;
          }
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
