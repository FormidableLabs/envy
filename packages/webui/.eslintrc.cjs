const path = require('path');

const rootConfig = require('../../.eslintrc.cjs');

module.exports = {
  ...rootConfig,
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended', ...rootConfig.extends],
  settings: {
    'react': { version: 'detect' },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        project: 'packages/webui/tsconfig.json',
      },
      alias: [['@', path.resolve(__dirname, './src')]],
    },
  },
  rules: {
    'react/button-has-type': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'react/jsx-key': ['error', { checkFragmentShorthand: true, warnOnDuplicates: true }],
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    ...rootConfig.rules,
  },
};
