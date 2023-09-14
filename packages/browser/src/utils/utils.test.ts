import { EventType } from '@envy/core';
import { twMerge } from 'tailwind-merge';

import { Trace } from '@/types';

import { cloneHeaders, getHeader, numberFormat, pathAndQuery, prettyFormat, tw } from './utils';

jest.mock('tailwind-merge');

describe('utils', () => {
  describe('pathAndQuery', () => {
    function mockTrace(req: Partial<Trace>): Trace {
      return {
        id: '1',
        parentId: undefined,
        type: EventType.HttpRequest,
        timestamp: 0,
        httpVersion: '1.1',
        method: 'GET',
        host: 'www.example.com',
        port: 443,
        path: '/',
        url: 'https://www.example.com/',
        requestHeaders: {},
        requestBody: undefined,
        ...req,
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

    it('should return undefined for the second item if no querystring is present', () => {
      const trace = mockTrace({ path: '/foo/bar' });
      const result = pathAndQuery(trace);

      expect(result[0]).toEqual('/foo/bar');
      expect(result[1]).toBeUndefined();
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

    it('should return lowercased header keys when specified', () => {
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

    it('should return undefined if header not found', () => {
      const result = getHeader(headers, 'banana');

      expect(result).toBeUndefined();
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
