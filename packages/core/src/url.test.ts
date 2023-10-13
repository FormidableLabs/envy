import { tryParseURL } from './url';

describe('url', () => {
  const cases = [
    ['/relative', undefined, undefined],
    ['/relative', 'localhost:3001', undefined],
    ['/relative', 'http://localhost:3001', 'http://localhost:3001/relative'],
    ['http://localhost:3001/path', undefined, 'http://localhost:3001/path'],
    [new URL('http://localhost:3001/another'), undefined, 'http://localhost:3001/another'],
  ];

  it.each(cases)('should tryparse', (url: any, base: any, expected: any) => {
    expect(tryParseURL(url, base)?.href).toEqual(expected);
  });
});
