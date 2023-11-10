import { Editor, EditorProps, OnMount } from '@monaco-editor/react';
import colors from 'tailwindcss/colors';

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

const setEditorTheme: OnMount = (editor, monaco) => {
  monaco.editor.defineTheme('envy', {
    base: 'vs',
    inherit: true,
    colors: {
      'editor.background': colors.gray['200'],
      'editor.lineHighlightBackground': colors.gray['200'],
    },
    rules: [],
  });
  monaco.editor.setTheme('envy');
  editor.trigger('fold', 'editor.foldLevel4', {});
};

export default function MonacoEditor({ value, language }: MonacoEditorProps) {
  return <Editor value={value} language={language} options={editorOptions} onMount={setEditorTheme} />;
}
