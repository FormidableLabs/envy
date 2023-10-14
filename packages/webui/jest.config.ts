import rootConfig from '../../jest.config';

export default {
  ...rootConfig,
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
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/bin/**',
    '!**/coverage/**',
  ],
};
