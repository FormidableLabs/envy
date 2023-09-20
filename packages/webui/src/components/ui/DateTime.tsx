import dayjs from 'dayjs';

export type DateTimeProps = React.HTMLAttributes<HTMLElement> & {
  time: number | undefined;
};

export default function DateTime({ time }: DateTimeProps) {
  if (time === undefined) return null;

  const formattedTime = dayjs(time).format('YYYY-MM-DD @ hh:mm:ss');

  return <>{formattedTime}</>;
}
