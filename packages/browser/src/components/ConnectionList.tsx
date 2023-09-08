import { HiOutlineEmojiSad } from 'react-icons/hi';

import { Loading } from '@/components/ui';
import useApplication from '@/hooks/useApplication';
import { ListDataComponent } from '@/systems';
import { ConnectionData } from '@/types';
import { tw } from '@/utils';

type MethodAndStatusProps = {
  method: string;
  statusCode?: number;
};

function MethodAndStatus({ method, statusCode }: MethodAndStatusProps) {
  return (
    <>
      <span className="block">{method.toUpperCase()}</span>
      <span className="block text-opacity-70 text-black text-xs font-semibold">{statusCode ?? '-'}</span>
    </>
  );
}

type ConnectionListProps = React.HTMLAttributes<HTMLElement>;

export default function ConnectionList({ className }: ConnectionListProps) {
  const { port, connected, connecting, connections, connectionId, setSelectedConnection } = useApplication();
  const data = Object.entries(connections);

  function getMethodAndStatus(connection: ConnectionData) {
    return <MethodAndStatus method={connection.req.method} statusCode={connection.res?.statusCode} />;
  }

  function rowStyle({ res }: ConnectionData) {
    let color = '';
    if (!res) color = '';
    else if (res.statusCode >= 500) color = 'bg-purple-500';
    else if (res.statusCode >= 400) color = 'bg-red-500';
    else if (res.statusCode >= 300) color = '';
    else if (res.statusCode >= 200) color = '';

    return color ? `bg-opacity-20 ${color}` : '';
  }

  function cellStyle({ res }: ConnectionData) {
    let color = 'border-transparent';
    if (!res) color = 'border-transparent';
    else if (res.statusCode >= 500) color = 'border-purple-500';
    else if (res.statusCode >= 400) color = 'border-red-500';
    else if (res.statusCode >= 300) color = 'border-yellow-500';
    else if (res.statusCode >= 200) color = 'border-green-500';
    return `border-0 border-l-8 ${color}`;
  }

  function getRequestURI(connection: ConnectionData) {
    return <ListDataComponent connection={connection} />;
  }

  function getRequestDuration(connection: ConnectionData) {
    return connection.duration ? `${(connection.duration / 1000).toFixed(2)}s` : <Loading size={2} />;
  }

  const columns: [
    string,
    (x: ConnectionData) => string | number | React.ReactNode,
    string,
    (x: ConnectionData) => string,
  ][] = [
    ['Method', getMethodAndStatus, 'w-[50px] md:w-[100px]', cellStyle],
    ['Request', getRequestURI, '', () => ''],
    ['Time', getRequestDuration, 'w-[50px] md:w-[100px] text-center', () => ''],
  ];

  return (
    <div className={`h-full flex flex-col overflow-y-scroll bg-slate-300 ${className}`}>
      {data.length === 0 ? (
        <div className="flex flex-none h-full justify-center items-center text-3xl md:text-6xl text-slate-400">
          {connected ? (
            `Server established on ws://localhost:${port} - waiting for data...`
          ) : connecting ? (
            'connecting...'
          ) : (
            <span className="flex items-center gap-2">
              <HiOutlineEmojiSad className="translate-y-[0.1em] w-8 h-8 md:w-16 md:h-16" />
              <span>unable to connect</span>
            </span>
          )}
        </div>
      ) : (
        <div className="table table-fixed w-full relative">
          <div className="flex-0 table-header-group gap-4 font-semibold sticky top-0 bg-slate-400 uppercase shadow-lg z-10">
            {columns.map(([label, , baseStyle]) => (
              <div key={label} className={`table-cell p-cell border-b border-slate-600 overflow-hidden ${baseStyle}`}>
                {label}
              </div>
            ))}
          </div>
          <div className="flex-1 table-row-group">
            {data.map(([id, connection], idx) => (
              <div
                key={id}
                onClick={() => setSelectedConnection(id)}
                className={tw(
                  'gap-4 table-row',
                  id === connectionId
                    ? 'bg-orange-300 shadow-lg'
                    : rowStyle(connection) ||
                        (idx % 2 === 0 ? 'bg-opacity-70 bg-slate-200' : 'bg-opacity-100 bg-slate-200'),
                  'hover:bg-orange-200 hover:cursor-pointer hover:shadow',
                )}
              >
                {columns.map(([, prop, baseStyle, cellStyle]) => (
                  <div
                    key={`${id}_${prop}`}
                    className={tw(
                      'table-cell p-cell align-middle overflow-hidden whitespace-nowrap text-ellipsis',
                      baseStyle || '',
                      cellStyle(connection) || '',
                    )}
                  >
                    {typeof prop === 'function' && prop(connection)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
