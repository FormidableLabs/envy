import { Editor, EditorProps, Monaco } from '@monaco-editor/react';
import colors from 'tailwindcss/colors';

export type MonacoEditorProps = Pick<EditorProps, 'value' | 'language'>;

const editorOptions: EditorProps['options'] = {
  minimap: {
    enabled: false,
  },
  readOnly: true,
  showFoldingControls: 'always',
  lineNumbers: 'off',
};

export default function MonacoEditor({ value, language }: MonacoEditorProps) {
  return <Editor value={value} language={language} options={editorOptions} onMount={setEditorTheme} />;
}

function setEditorTheme(_: any, monaco: Monaco) {
  monaco.editor.defineTheme('envy', {
    base: 'vs',
    inherit: true,
    colors: {
      'editor.background': colors.slate['100'],
    },
    rules: [],
  });
  monaco.editor.setTheme('envy');
}
