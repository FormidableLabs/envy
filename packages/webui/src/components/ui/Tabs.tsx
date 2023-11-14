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

  const allowInteractive = !(disabled || selectedTab === id);

  const className = tw(
    'inline-block px-3 py-2 rounded-[0.25rem] font-bold uppercase text-xs',
    'text-manatee-800',
    allowInteractive && 'hover:bg-apple-200 hover:text-apple-900',
    allowInteractive && 'active:bg-apple-500 active:text-apple-950',
    disabled && 'text-gray-400 cursor-not-allowed',
    selectedTab === id && 'bg-apple-400 text-[#0D280B]',
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
