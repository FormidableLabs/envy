export type DateTimeProps = React.HTMLAttributes<HTMLElement> & {
  time: number | undefined;
};

export default function DateTime({ time }: DateTimeProps) {
  if (time === undefined) return null;

  const date = new Date(time);
  const formattedTime = `${date.toLocaleDateString()} @ ${date.toLocaleTimeString()}`;

  return <>{formattedTime}</>;
}
