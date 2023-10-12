import {
  getEventFromFetchRequest,
  getEventFromFetchResponse,
  getUrlFromFetchRequest,
  parseFetchHeaders,
} from './fetch';

describe('fetch', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(2023, 10, 1));
  });

  describe('getEventFromFetchRequest', () => {
    it('should map a fetch request from a string url', () => {
      const request = getEventFromFetchRequest('1', 'http://localhost/api/path');
      expect(request).toEqual({
        http: {
          host: 'localhost',
          method: 'GET',
          path: '/api/path',
          port: NaN,
          requestHeaders: {},
          state: 'sent',
          url: 'http://localhost/api/path',
        },
        id: '1',
        timestamp: 1698814800000,
      });
    });

    it('should parse the host port number', () => {
      const request = getEventFromFetchRequest('1', 'http://localhost:5671/api/path');
      expect(request).toEqual({
        http: {
          host: 'localhost:5671',
          method: 'GET',
          path: '/api/path',
          port: 5671,
          requestHeaders: {},
          state: 'sent',
          url: 'http://localhost:5671/api/path',
        },
        id: '1',
        timestamp: 1698814800000,
      });
    });

    it('should map the fetch request headers', () => {
      const init: RequestInit = {
        headers: {
          'x-array': 'value1',
          'x-key': 'key1',
        },
      };

      const request = getEventFromFetchRequest('1', 'http://localhost/api/path', init);
      expect(request).toEqual({
        http: {
          host: 'localhost',
          method: 'GET',
          path: '/api/path',
          port: NaN,
          requestHeaders: {
            'x-array': 'value1',
            'x-key': 'key1',
          },
          state: 'sent',
          url: 'http://localhost/api/path',
        },
        id: '1',
        timestamp: 1698814800000,
      });
    });

    it('should map the fetch request body', () => {
      const init: RequestInit = {
        body: new URLSearchParams('key=value&name=test'),
      };

      const request = getEventFromFetchRequest('1', 'http://localhost/api/path', init);
      expect(request).toEqual({
        http: {
          host: 'localhost',
          method: 'GET',
          path: '/api/path',
          port: NaN,
          requestHeaders: {},
          requestBody: 'key=value&name=test',
          state: 'sent',
          url: 'http://localhost/api/path',
        },
        id: '1',
        timestamp: 1698814800000,
      });
    });
  });

  describe('getEventFromFetchRequest', () => {
    it('should map a fetch response', async () => {
      const request = getEventFromFetchRequest('1', 'http://localhost/api/path');
      const response = await getEventFromFetchResponse(request, {
        headers: new Headers({ key: 'value' }),
        ok: true,
        redirected: false,
        status: 200,
        statusText: 'OK',
        type: 'default',
        url: 'http://localhost/api/path',
        text: () => Promise.resolve('test'),
      } as Response);

      expect(response).toEqual({
        http: {
          host: 'localhost',
          httpVersion: 'default',
          method: 'GET',
          path: '/api/path',
          port: NaN,
          requestBody: undefined,
          requestHeaders: {},
          responseBody: 'test',
          responseHeaders: {
            key: 'value',
          },
          state: 'received',
          statusCode: 200,
          statusMessage: 'OK',
          url: 'http://localhost/api/path',
        },
        id: '1',
        parentId: undefined,
        timestamp: 1698814800000,
      });
    });
  });

  describe('getUrlFromFetchRequest', () => {
    it('should parse a Request type', () => {
      const info = new Request('http://localhost/api/path');
      expect(getUrlFromFetchRequest(info)?.href).toEqual('http://localhost/api/path');
    });

    it('should parse a URL type', () => {
      const info = new URL('http://localhost/web');
      expect(getUrlFromFetchRequest(info)?.href).toEqual('http://localhost/web');
    });

    it('should parse a fully qualified string type', () => {
      const info = 'http://localhost/api/path';
      expect(getUrlFromFetchRequest(info)?.href).toEqual('http://localhost/api/path');
    });

    it('should return a default for unqualified relative urls', () => {
      const info = '/api/path';
      expect(getUrlFromFetchRequest(info)?.href).toBe('http://localhost/');
    });

    describe('jsDom', () => {
      beforeAll(() => {
        globalThis.location = {
          origin: 'http://localhost:2700',
        } as any;
      });

      afterAll(() => {
        globalThis.location = {} as any;
      });

      it('should parse a relative url when window is set', () => {
        const info = '/api/path';
        expect(getUrlFromFetchRequest(info)?.href).toEqual('http://localhost:2700/api/path');
      });
    });
  });

  describe('parseFetchHeaders', () => {
    it('should map header value pairs', () => {
      const headers = parseFetchHeaders([
        ['key', 'value'],
        ['name', 'test'],
      ]);

      expect(headers).toEqual({
        key: 'value',
        name: 'test',
      });
    });

    it('should map header record', () => {
      const headers = parseFetchHeaders({
        key: 'value',
        name: 'test',
      });

      expect(headers).toEqual({
        key: 'value',
        name: 'test',
      });
    });

    it('should map header object', () => {
      const headers = parseFetchHeaders(
        new Headers({
          key: 'value',
          name: 'test',
        }),
      );

      expect(headers).toEqual({
        key: 'value',
        name: 'test',
      });
    });
  });
});
