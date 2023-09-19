import rootConfig from '../../jest.config';

export default {
  ...rootConfig,
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/testing/setupJest.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    './src/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/bin/**',
    '!**/coverage/**',
  ],
};