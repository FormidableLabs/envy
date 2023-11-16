import { Editor, EditorProps, OnMount } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';

export type MonacoEditorProps = Pick<EditorProps, 'value' | 'language'>;

const editorOptions: EditorProps['options'] = {
  minimap: {
    enabled: false,
  },
  readOnly: true,
  scrollBeyondLastLine: false,
  showFoldingControls: 'always',
  lineNumbers: 'off',
};

export default function MonacoEditor({ value, language }: MonacoEditorProps) {
  const editorRef = useRef<Parameters<OnMount>['0'] | null>(null);

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
        'editor.background': '#F5F7F8',
        'editor.lineHighlightBackground': '#F5F7F8',
      },
      rules: [],
    });
    monaco.editor.setTheme('envy');

    executeFolding();
  };

  useEffect(executeFolding, [value, language]);

  return <Editor value={value} language={language} options={editorOptions} onMount={onMount} />;
}
