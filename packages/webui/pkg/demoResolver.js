import path from 'path';

import { Resolver } from '@parcel/plugin';

const isProduction = process.env.NODE_ENV === 'production';
const isDemo = process.env.DEMO === 'true';

const productionCode = `
const mockTraces = [];
export default mockTraces;
export function mockTraceCollection() {
  return new Map();
}
`;

export default new Resolver({
  async resolve({ specifier }) {
    // remove mock traces in production unless its a demo
    if (isProduction && !isDemo) {
      if (specifier === '@/testing/mockTraces') {
        return {
          filePath: path.resolve('dummy.ts'),
          code: productionCode,
        };
      }
    }
    return null;
  },
});
