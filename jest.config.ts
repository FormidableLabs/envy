export default {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'ts-jest-mock-import-meta',
              options: { metaObjectReplacement: { url: 'https://www.url.com/' } },
            },
          ],
        },
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/src/**/?(*.)+(spec|test).[jt]s?(x)'],
};
