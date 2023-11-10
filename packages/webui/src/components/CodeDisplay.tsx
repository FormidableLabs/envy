import { safeParseJson } from '@envyjs/core';
import { Suspense, lazy } from 'react';

import { MonacoEditorProps } from './MonacoEditor';

const Editor = lazy<React.ComponentType<MonacoEditorProps>>(async () => await import('./MonacoEditor'));

type CodeDisplayProps = {
  contentType?: string | string[] | null;
  data: string | null | undefined;
};

const languageMap: Record<string, MonacoEditorProps['language']> = {
  'application/json': 'json',
  'application/graphql-response+json': 'json',
  'application/xml': 'xml',
};

export default function CodeDisplay({ data, contentType }: CodeDisplayProps) {
  if (!data) {
    return;
  }

  // content types can be an array or a string value
  // each value in the array or string can be a content type with a charset
  // example: [content-type: application/json; charset=utf-8]
  let resolvedContentType = Array.isArray(contentType) ? contentType[0] : contentType;
  resolvedContentType = resolvedContentType && resolvedContentType.split(';')[0];
  const lang = resolvedContentType ? languageMap[resolvedContentType as string] : 'txt';

  // TODO: Add support for XML formatting
  let value = data;
  if (lang === 'json') {
    const parseResult = safeParseJson(data);
    if (parseResult.value) {
      value = JSON.stringify(parseResult.value, null, 2);
    }
  }

  return (
    <Suspense fallback={<></>}>
      <div className="w-full h-full">
        <Editor value={value} language={lang} />
      </div>
    </Suspense>
  );
}
