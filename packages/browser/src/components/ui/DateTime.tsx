export type DateTimeProps = React.HTMLAttributes<HTMLElement> & {
  time: number | undefined;
};

export default function DateTime({ time }: DateTimeProps) {
  if (time === undefined) return null;

  const formattedTime = new Date(time)
    .toISOString()
    .replace('T', ' @ ')
    .substring(0, 25);

  return <>{formattedTime}</>;
}
