import { prettyFormat, tw } from '@/utils';

type CodeProps = React.HTMLAttributes<HTMLElement> & {
  inline?: boolean;
  prettify?: boolean;
};

export default function Code({ inline = false, prettify = true, className, children }: CodeProps) {
  if (inline) return <div className={`code-inline ${className}`}>{children}</div>;

  let content: string;
  if (typeof children === 'object') content = JSON.stringify(children, null, 2);
  else content = children?.toString() ?? '';

  const finalContent = prettify ? prettyFormat(content || '') : content;
  const lines = finalContent.split('\n');

  const code = (
    <ul>
      {lines.map((x, idx) => (
        <li key={idx} className="">
          {x}
        </li>
      ))}
    </ul>
  );

  return <div className={tw('code-block', className)}>{code}</div>;
}
