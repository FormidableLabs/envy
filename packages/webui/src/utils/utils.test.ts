import { twMerge } from 'tailwind-merge';

import { Trace } from '@/types';

import {
  cloneHeaders,
  flatMapHeaders,
  getHeader,
  numberFormat,
  pathAndQuery,
  prettyFormat,
  safeParseJson,
  tw,
} from './utils';

jest.mock('tailwind-merge');

describe('utils', () => {
  describe('pathAndQuery', () => {
    function mockTrace(req: Partial<Trace['http']>): Trace {
      return {
        id: '1',
        parentId: undefined,
        timestamp: 0,
        http: {
          httpVersion: '1.1',
          method: 'GET',
          host: 'www.example.com',
          port: 443,
          path: '/',
          url: 'https://www.example.com/',
          requestHeaders: {},
          requestBody: undefined,
          ...req,
        },
      };
    }

    it('should return path and as an array', () => {
      const trace = mockTrace({ path: '/foo/bar?baz=qux' });
      const result = pathAndQuery(trace);

      expect(result).toBeInstanceOf(Array);
    });

    it('should return two items in the array', () => {
      const trace = mockTrace({ path: '/foo/bar?baz=qux' });
      const result = pathAndQuery(trace);

      expect(result).toHaveLength(2);
    });

    it('should return the path as the first item', () => {
      const trace = mockTrace({ path: '/foo/bar?baz=qux' });
      const result = pathAndQuery(trace);

      expect(result[0]).toEqual('/foo/bar');
    });

    it('should return the querystring as the second item', () => {
      const trace = mockTrace({ path: '/foo/bar?baz=qux' });
      const result = pathAndQuery(trace);

      expect(result[1]).toEqual('baz=qux');
    });

    it('should default to an empty string path if one is not supplied', () => {
      const trace = mockTrace({ path: undefined });
      const result = pathAndQuery(trace);

      expect(result[0]).toEqual('');
    });

    it('should return undefined for the second item if no querystring is present', () => {
      const trace = mockTrace({ path: '/foo/bar' });
      const result = pathAndQuery(trace);

      expect(result[0]).toEqual('/foo/bar');
      expect(result[1]).toBeUndefined();
    });

    it('should not decode querystring values by default`', () => {
      const trace = mockTrace({ path: '/foo/bar?data=foo%20and%20bar' });
      const result = pathAndQuery(trace, false);

      expect(result[1]).toBe('data=foo%20and%20bar');
    });

    it('should not decode querystring values if `decodeQs` is `false`', () => {
      const trace = mockTrace({ path: '/foo/bar?data=foo%20and%20bar' });
      const result = pathAndQuery(trace, false);

      expect(result[1]).toBe('data=foo%20and%20bar');
    });

    it('should decode querystring values if `decodeQs` is `true`', () => {
      const trace = mockTrace({ path: '/foo/bar?data=foo%20and%20bar' });
      const result = pathAndQuery(trace, true);

      expect(result[1]).toBe('data=foo and bar');
    });
  });

  describe('numberFormat', () => {
    it('should format 0 as "0"', () => {
      const result = numberFormat(0);

      expect(result).toBe('0');
    });

    it('should format 999 as "999"', () => {
      const result = numberFormat(999);

      expect(result).toBe('999');
    });

    it('should format 1000 as "1,000"', () => {
      const result = numberFormat(1000);

      expect(result).toBe('1,000');
    });

    it('should format 1000000 as "1,000,000"', () => {
      const result = numberFormat(1000000);

      expect(result).toBe('1,000,000');
    });
  });

  describe('cloneHeaders', () => {
    it('should return an empty object if no headers supplied', () => {
      const result = cloneHeaders(undefined);

      expect(result).toEqual({});
    });

    it('should return identical headers in a new object', () => {
      const originalHeaders = {
        foo: 'bar',
        baz: 'qux',
      };

      const result = cloneHeaders(originalHeaders);

      expect(result).toEqual(originalHeaders);
      expect(result).not.toBe(originalHeaders);
    });

    it('should transform header keys to lowercased by default', () => {
      const originalHeaders = {
        Foo: 'BAR',
        Baz: 'qux',
      };

      const result = cloneHeaders(originalHeaders, true);

      expect(result).toEqual({
        foo: 'BAR',
        baz: 'qux',
      });
    });

    it('should transform header keys to lowercased when `lowercase` is `true`', () => {
      const originalHeaders = {
        Foo: 'BAR',
        Baz: 'qux',
      };

      const result = cloneHeaders(originalHeaders, true);

      expect(result).toEqual({
        foo: 'BAR',
        baz: 'qux',
      });
    });

    it('should not transform header keys to lowercased when `lowercase` is `false`', () => {
      const originalHeaders = {
        Foo: 'BAR',
        Baz: 'qux',
      };

      const result = cloneHeaders(originalHeaders, false);

      expect(result).toEqual({
        Foo: 'BAR',
        Baz: 'qux',
      });
    });
  });

  describe('flatMapHeaders', () => {
    it('should return an empty object if no headers supplied', () => {
      const result = flatMapHeaders(undefined);

      expect(result).toEqual({});
    });

    it('should return identical headers in a new object', () => {
      const originalHeaders = {
        foo: 'bar',
        baz: 'qux',
      };

      const result = flatMapHeaders(originalHeaders);

      expect(result).toEqual(originalHeaders);
      expect(result).not.toBe(originalHeaders);
    });

    it('should transform header array values to comma delimited strings', () => {
      const originalHeaders = {
        foo: ['bar', 'baz'],
        bar: ['baz', 'qux'],
      };

      const result = flatMapHeaders(originalHeaders);

      expect(result).toEqual({
        foo: 'bar,baz',
        bar: 'baz,qux',
      });
    });

    it('should retain header string values', () => {
      const originalHeaders = {
        foo: 'bar',
        baz: 'qux',
      };

      const result = flatMapHeaders(originalHeaders);

      expect(result).toEqual({
        foo: 'bar',
        baz: 'qux',
      });
    });
  });

  describe('getHeader', () => {
    const headers = {
      Foo: 'BAR',
      baz: 'qux',
    };
    it('should return null if no headers supplied', () => {
      const result = getHeader(undefined, 'foo');

      expect(result).toBeNull();
    });

    it('should return value if header found', () => {
      const result = getHeader(headers, 'Foo');

      expect(result).toEqual('BAR');
    });

    it('should return value if header found', () => {
      const result = getHeader(headers, 'Foo');

      expect(result).toEqual('BAR');
    });

    it('should not be case sensitive when finding headers', () => {
      const result = getHeader(headers, 'foo');

      expect(result).toEqual('BAR');
    });

    it('should return null if header not found', () => {
      const result = getHeader(headers, 'banana');

      expect(result).toBeNull();
    });
  });

  describe('safeParseJson', () => {
    it('should return parsed JSON if input is valid', () => {
      const result = safeParseJson('{"foo":"bar"}');
      expect(result).toEqual({ foo: 'bar' });
    });

    it('should return null if input is invalid', () => {
      const result = safeParseJson('{"foo"');
      expect(result).toBeNull();
    });

    it('should return null if input is undefined', () => {
      const result = safeParseJson(undefined);
      expect(result).toBeNull();
    });
  });

  describe('prettyFormat', () => {
    it('should return empty string if code is empty string', () => {
      const result = prettyFormat('');

      expect(result).toEqual('');
    });

    it('should return code with pretty indentation', () => {
      const badlyFormattedJson = `{
        "foo": "bar",
                "baz": "qux"
              }`;
      const wellFormattedJson = `{
  "foo": "bar",
  "baz": "qux"
}`;

      const result = prettyFormat(badlyFormattedJson);
      expect(result).toEqual(wellFormattedJson);
    });
  });

  describe('tw', () => {
    it('should proxy to twMerge', () => {
      tw('foo', 'bar', 'baz');

      expect(jest.mocked(twMerge)).toHaveBeenCalledWith('foo', 'bar', 'baz');
    });
  });
});
