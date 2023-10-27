export default {
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/src/**/?(*.)+(spec|test).[jt]s?(x)'],
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/testing/setupJest.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/testing/setupJestAfterEnv.ts'],
  globalSetup: '<rootDir>/src/testing/setupJestGlobal.ts',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',

    // support css imports in react components
    '.+\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    './src/**/*.{ts,tsx}',
    '!./src/testing/**/*.{ts,tsx}',
    '!./src/**/*.stories.{ts,tsx}',
    '!./src/**/__storybook__mocks__/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/bin/**',
    '!**/coverage/**',
  ],
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
