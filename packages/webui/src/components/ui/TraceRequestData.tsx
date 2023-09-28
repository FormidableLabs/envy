import useApplication from '@/hooks/useApplication';

export type TraceRequestDataProps = {
  iconPath: string;
  hostName?: string;
  path: string;
  data?: string;
};

export default function TraceRequestData({ iconPath, hostName, path, data }: TraceRequestDataProps) {
  const { selectedTraceId } = useApplication();
  const pathValue = !!selectedTraceId ? `.../${path.split('/').splice(-1, 1).join('/')}` : path;

  return (
    <>
      <span data-test-id="item-request" className="flex flex-row items-center">
        <img data-test-id="item-image" src={iconPath} alt="" className="flex-0 inline-block w-4 h-4 mr-1.5" />
        {hostName && (
          <span data-test-id="item-hostname" className="font-semibold pr-1">
            {hostName}
          </span>
        )}
        {data && <span data-test-id="item-path">{pathValue}</span>}
      </span>
      {!data && (
        <span data-test-id="item-path" className="block font text-opacity-70 text-black text-xs font-mono">
          {pathValue}
        </span>
      )}
      {data && (
        <span data-test-id="item-data" className="block font text-opacity-70 text-black text-xs font-mono">
          {data}
        </span>
      )}
    </>
  );
}
