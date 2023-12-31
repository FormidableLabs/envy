import useApplication from '@/hooks/useApplication';

export type TraceRequestDataProps = {
  systemName: string;
  iconPath: string;
  hostName?: string;
  path: string;
  data?: string;
};

export default function TraceRequestData({ systemName, iconPath, hostName, path, data }: TraceRequestDataProps) {
  const { selectedTraceId } = useApplication();
  const pathValue = !!selectedTraceId ? `.../${path.split('/').splice(-1, 1).join('/')}` : path;

  return (
    <>
      <span data-test-id="item-request" className="flex flex-row items-center">
        <img data-test-id="item-image" src={iconPath} alt={systemName} className="flex-0 inline-block w-4 h-4 mr-1.5" />
        {hostName && (
          <span data-test-id="item-hostname" className="font-bold">
            {hostName}
          </span>
        )}
        <span data-test-id="item-path">{pathValue}</span>
      </span>
      {data && (
        <span data-test-id="item-data" className="block text-2xs font-mono">
          {data}
        </span>
      )}
    </>
  );
}
