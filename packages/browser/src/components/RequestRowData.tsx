import useApplication from '@/hooks/useApplication';

export type RequestHeadingProps = {
  iconPath: string;
  hostName: string;
  path: string;
  data?: string;
};

export function RequestRowData({
  iconPath,
  hostName,
  path,
  data,
}: RequestHeadingProps) {
  const { connectionId } = useApplication();
  const hasSelected = !!connectionId;
  const pathValue = hasSelected
    ? `.../${path.split('/').splice(-1, 1).join('/')}`
    : path;
  return (
    <>
      <span className="flex flex-row items-center">
        <img
          src={iconPath}
          alt=""
          className="flex-0 inline-block w-4 h-4 mr-1.5"
        />
        <span className="font-semibold pr-1">{hostName}</span>
        <span>{pathValue}</span>
      </span>
      <span className="block font text-opacity-70 text-black text-xs font-mono">
        {data || null}
      </span>
    </>
  );
}
