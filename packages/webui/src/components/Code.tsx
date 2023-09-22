import { prettyFormat, tw } from '@/utils';

type CodeProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  inline?: boolean;
  prettify?: boolean;
  children?: React.ReactNode | Record<string, unknown> | undefined;
};

export default function Code({ inline = false, prettify = true, className, children, ...props }: CodeProps) {
  let content: string;
  if (typeof children === 'object') content = JSON.stringify(children, null, 2);
  else content = children?.toString() ?? '';

  if (inline)
    return (
      <div className={tw('code-inline', className)} {...props}>
        {content}
      </div>
    );

  const finalContent = content && prettify ? prettyFormat(content) : content;
  const lines = finalContent.split('\n');

  return (
    <div className={tw('code-block', className)} {...props}>
      <ul>
        {lines.map((x, idx) => (
          <li key={idx}>{x}</li>
        ))}
      </ul>
    </div>
  );
}
