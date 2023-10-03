import { safeParseJson } from './json';

describe('safeParseJson', () => {
  it('should return parsed JSON if input is valid', () => {
    const result = safeParseJson('{"foo":"bar"}');
    expect(result).toEqual({ value: { foo: 'bar' } });
  });

  it('should return null if input is invalid', () => {
    const result = safeParseJson('{"foo"');
    expect(result).toEqual({ error: new SyntaxError('Unexpected end of JSON input') });
  });

  it('should return null if input is undefined', () => {
    const result = safeParseJson(undefined);
    expect(result).toEqual({});
  });
});
