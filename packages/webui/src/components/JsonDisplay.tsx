import { safeParseJson } from '@envyjs/core';
import { Suspense, lazy } from 'react';
import { ReactJsonViewProps } from 'react-json-view';
import colors from 'tailwindcss/colors';

import { tw } from '@/utils';

const ReactJson = lazy<React.ComponentType<ReactJsonViewProps>>(async () => await import('react-json-view'));

type JsonDisplayProps = Omit<React.HTMLAttributes<HTMLElement>, 'children'> & {
  className?: string;
  children: object | string;
};

const bg = colors.slate['100'];
const fg = colors.black;
const lines = colors.slate['200'];
const meta = colors.slate['400'];
const accent = colors.orange['300'];

const customTheme = {
  base00: bg,
  base01: accent,
  base02: lines,
  base03: fg,
  base04: meta,
  base05: accent,
  base06: fg,
  base07: fg,
  base08: fg,
  base09: fg,
  base0A: fg,
  base0B: fg,
  base0C: fg,
  base0D: meta,
  base0E: meta,
  base0F: fg,
};

export default function JsonDisplay({ className, children }: JsonDisplayProps) {
  const errorData = { error: 'Error parsing JSON data', data: children };
  const src = typeof children === 'string' ? safeParseJson(children).value ?? errorData : children;

  return (
    <Suspense fallback={<></>}>
      <div className={tw('w-full overflow-auto', className)}>
        <ReactJson
          src={src}
          theme={customTheme}
          name={null}
          collapsed={3}
          collapseStringsAfterLength={50}
          displayDataTypes={false}
          enableClipboard={true}
          indentWidth={2}
          iconStyle="circle"
        />
      </div>
    </Suspense>
  );
}
