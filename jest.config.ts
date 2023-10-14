import type { JestConfigWithTsJest } from 'ts-jest';

const jestConfig: JestConfigWithTsJest = {
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  transform: {
    // default ts-jest preset
    '^.+\\.tsx?$': 'ts-jest',

    // support for mjs files
    '^.+\\.mjs?$': [
      'babel-jest',
      {
        presets: ['@babel/preset-env'],
        targets: {
          node: 'current',
        },
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!allotment).+\\.mjs$'],
};

export default jestConfig;
