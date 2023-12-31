import { safeParseJson } from '@envyjs/core';
import formatXml from 'xml-formatter';

import { tw } from '@/utils';

import Editor, { EditorHeight, MonacoEditorProps } from './MonacoEditor';

type CodeDisplayProps = {
  contentType?: string | string[] | null;
  data: string | null | undefined;
  editorHeight?: EditorHeight;
  className?: string;
};

const languageMap: Record<string, MonacoEditorProps['language']> = {
  'application/json': 'json',
  'application/graphql-response+json': 'json',
  'application/xml': 'xml',
};

export default function CodeDisplay({ data, contentType, editorHeight, className }: CodeDisplayProps) {
  if (!data) {
    return;
  }

  // content types can be an array or a string value
  // each value in the array or string can be a content type with a charset
  // example: [content-type: application/json; charset=utf-8]
  let resolvedContentType = Array.isArray(contentType) ? contentType[0] : contentType;
  resolvedContentType = resolvedContentType && resolvedContentType.split(';')[0];
  const lang = resolvedContentType ? languageMap[resolvedContentType as string] : 'txt';

  let value = data;
  if (lang === 'json') {
    const parseResult = safeParseJson(data);
    if (parseResult.value) {
      value = JSON.stringify(parseResult.value, null, 2);
    }
  } else if (lang === 'xml') {
    value = formatXml(data, {
      indentation: '  ',
      lineSeparator: '\n',
      collapseContent: true,
      whiteSpaceAtEndOfSelfclosingTag: true,
    });
  }

  return (
    <div className={tw('w-full h-full', className)}>
      <Editor value={value} language={lang} height={editorHeight} />
    </div>
  );
}
