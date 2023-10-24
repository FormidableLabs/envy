export type TraceRequestDataProps = {
  iconPath: string;
  hostName?: string;
  path: string;
  data?: string;
};

export default function TraceRequestData({ iconPath, hostName, path, data }: TraceRequestDataProps) {
  return (
    <>
      <span data-test-id="item-request" className="flex flex-row items-center">
        <img data-test-id="item-image" src={iconPath} alt="" className="inline-block w-4 h-4 mr-1.5" />
        {hostName && (
          <span data-test-id="item-hostname" className="font-semibold pr-1">
            {hostName}
          </span>
        )}
        <span data-test-id="item-path" className="flex-1">
          {path}
        </span>
      </span>
      {data && (
        <span data-test-id="item-data" className="block text-xs font-mono text-secondary">
          {data}
        </span>
      )}
    </>
  );
}
