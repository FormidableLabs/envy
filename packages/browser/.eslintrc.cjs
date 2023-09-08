const rootConfig = require('../../.eslintrc.cjs');

module.exports = {
  ...rootConfig,
  extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended', ...rootConfig.extends],
  settings: {
    react: { version: 'detect' },
    ...rootConfig.settings,
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
