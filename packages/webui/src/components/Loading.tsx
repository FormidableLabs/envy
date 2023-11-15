import { tw } from '@/utils';

type LoadingProps = React.HTMLAttributes<HTMLElement> & {
  size?: 2 | 3 | 4 | 8 | 32;
};

export default function Loading({ size = 2, className, ...props }: LoadingProps) {
  return (
    <div className={className}>
      <div
        className={tw(
          'inline-block rounded-full border-manatee-400 opacity-70 animate-spin',
          size === 2 ? 'w-2 h-2 border-2' : '',
          size === 3 ? 'w-3 h-3 border-2' : '',
          size === 4 ? 'w-4 h-4 border-2' : '',
          size === 8 ? 'w-8 h-8 border-4' : '',
          size === 32 ? 'w-32 h-32 border-[1.5rem]' : '',
          'border-t-transparent',
        )}
        {...props}
      ></div>
    </div>
  );
}
