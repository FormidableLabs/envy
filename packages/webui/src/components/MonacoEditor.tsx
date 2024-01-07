import { Editor, EditorProps, OnMount } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

export type EditorHeight = 'full' | 'auto';

export type MonacoEditorProps = Pick<EditorProps, 'value' | 'language'> & {
  height?: EditorHeight;
};

const defaultOptions: EditorProps['options'] = {
  minimap: {
    enabled: false,
  },
  readOnly: true,
  scrollBeyondLastLine: false,
  showFoldingControls: 'always',
  lineNumbers: 'off',
};

const autoHeightOptions: EditorProps['options'] = {
  ...defaultOptions,
  scrollbar: {
    alwaysConsumeMouseWheel: false,
  },
};

export default function MonacoEditor({ value, language, height = 'auto' }: MonacoEditorProps) {
  const editorRef = useRef<Parameters<OnMount>['0'] | null>(null);

  const isAutoHeight = height === 'auto';

  const executeFolding = () => {
    if (!editorRef.current) return;

    // fold deeply nested objects
    editorRef.current?.trigger('fold', 'editor.foldLevel7', {});
    editorRef.current?.trigger('fold', 'editor.foldLevel6', {});
    editorRef.current?.trigger('fold', 'editor.foldLevel5', {});
    editorRef.current?.trigger('fold', 'editor.foldLevel4', {});
  };

  const onMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme('envy', {
      base: 'vs',
      inherit: true,
      colors: {
        'editor.background': '#EEEEF1',
      },
      rules: [],
    });
    monaco.editor.setTheme('envy');

    if (isAutoHeight) {
      const updateHeight = () => {
        const height = editor.getContentHeight();
        const width = editor.getScrollWidth();
        editor.layout({ width, height });
      };

      editor.onDidContentSizeChange(updateHeight);
      updateHeight();
    }

    executeFolding();
  };

  useEffect(executeFolding, [value, language]);

  return (
    <Editor
      value={value}
      language={language}
      options={isAutoHeight ? autoHeightOptions : defaultOptions}
      onMount={onMount}
    />
  );
}
