import { cleanup, render } from '@testing-library/react';
import { ReactElement } from 'react';

import { TraceRequestDataProps } from '@/components/ui/TraceRequestData';
import { setupMockSystems } from '@/testing/mockSystems';
import mockTraces from '@/testing/mockTraces';
import { Trace } from '@/types';

import {
  ListDataComponent,
  RequestDetailsComponent,
  ResponseDetailsComponent,
  getIconUri,
  getRequestBody,
  getResponseBody,
} from '.';

jest.mock('@/systems/registration');

jest.mock(
  '@/components/ui/TraceRequestData',
  () =>
    function MockTraceRequestData({ iconPath, hostName, path, data }: TraceRequestDataProps) {
      return (
        <>
          {iconPath} | {hostName} | {path} | {data}
        </>
      );
    }
);

describe('Systems', () => {
  beforeEach(() => {
    setupMockSystems();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    cleanup();
  });

  describe('requests which satisfy the Foo system', () => {
    const mockTrace = mockTraces[0];
    const trace = {
      ...mockTrace,
      id: 'foo_id',
      http: {
        ...mockTrace.http,
        host: 'www.foo.com',
        path: '/foo?query=foo',
        requestBody: 'foo_request_body',
        responseBody: 'foo_response_body',
      },
    } as Trace;

    it('should return correct value for `getSystemIconPath`', () => {
      const result = getIconUri(trace);
      expect(result).toEqual('foo_icon');
    });

    it('should return correct value for `getRequestBody`', () => {
      const result = getRequestBody(trace);
      expect(result).toEqual('transformed_foo_request_body_foo_id');
    });

    it('should return correct value for `getResponseBody`', () => {
      const result = getResponseBody(trace);
      expect(result).toEqual('transformed_foo_response_body_foo_id');
    });

    it('should return correct data in the `ListDataComponent`', () => {
      const component = ListDataComponent({ trace });
      const { container } = render(component as ReactElement);
      expect(container).toHaveTextContent('foo_icon | www.foo.com | /foo | Foo data: foo_id');
    });

    it('should return correct `SystemRequestDetailsComponent`', () => {
      const component = RequestDetailsComponent({ trace });
      const { container } = render(component as ReactElement);
      expect(container).toHaveTextContent('SystemRequestDetailsComponent: Foo foo_id');
    });

    it('should return correct `SystemResponseDetailsComponent`', () => {
      const component = ResponseDetailsComponent({ trace });
      const { container } = render(component as ReactElement);
      expect(container).toHaveTextContent('SystemResponseDetailsComponent: Foo foo_id');
    });
  });

  describe('requests which satisfy the Bar system', () => {
    const mockTrace = mockTraces[0];
    const trace = {
      ...mockTrace,
      id: 'bar_id',
      http: {
        ...mockTrace.http,
        host: 'www.bar.com',
        path: '/bar?query=bar',
        requestBody: 'bar_request_body',
        responseBody: 'bar_response_body',
      },
    } as Trace;

    it('should return correct value for `getIconUri`', () => {
      const result = getIconUri(trace);
      expect(result).toEqual('bar_icon');
    });

    it('should return correct value for `getRequestBody`', () => {
      const result = getRequestBody(trace);
      expect(result).toEqual('transformed_bar_request_body_bar_id');
    });

    it('should return correct value for `getResponseBody`', () => {
      const result = getResponseBody(trace);
      expect(result).toEqual('transformed_bar_response_body_bar_id');
    });

    it('should return correct data in the `ListDataComponent`', () => {
      const component = ListDataComponent({ trace });
      const { container } = render(component as ReactElement);
      expect(container).toHaveTextContent('bar_icon | www.bar.com | /bar | Bar data: bar_id');
    });

    it('should return correct `SystemRequestDetailsComponent`', () => {
      const component = RequestDetailsComponent({ trace });
      const { container } = render(component as ReactElement);
      expect(container).toHaveTextContent('SystemRequestDetailsComponent: Bar bar_id');
    });

    it('should return correct `SystemResponseDetailsComponent`', () => {
      const component = ResponseDetailsComponent({ trace });
      const { container } = render(component as ReactElement);
      expect(container).toHaveTextContent('SystemResponseDetailsComponent: Bar bar_id');
    });
  });

  describe('requests which satisfy a system which relies on fallbacks to the Default system', () => {
    const mockTrace = mockTraces[0];
    const trace = {
      ...mockTrace,
      id: 'fallback_id',
      http: {
        ...mockTrace.http,
        host: 'www.fallback.com',
        path: '/fallback?query=fallback',
        requestBody: 'fallback_request_body',
        responseBody: 'fallback_response_body',
      },
    } as Trace;

    it('should return correct value for `getSystemIconPath`', () => {
      const result = getIconUri(trace);
      expect(result).toEqual('default_icon');
    });

    it('should return correct value for `getRequestBody`', () => {
      const result = getRequestBody(trace);
      expect(result).toEqual('default_fallback_request_body_fallback_id');
    });

    it('should return correct value for `getResponseBody`', () => {
      const result = getResponseBody(trace);
      expect(result).toEqual('default_fallback_response_body_fallback_id');
    });

    it('should return correct data in the `ListDataComponent`', () => {
      const component = ListDataComponent({ trace });
      const { container } = render(component as ReactElement);
      expect(container).toHaveTextContent('default_icon | www.fallback.com | /fallback | query=fallback');
    });

    it('should return correct `SystemRequestDetailsComponent`', () => {
      const component = RequestDetailsComponent({ trace });
      expect(component).toBeNull();
    });

    it('should return correct `SystemResponseDetailsComponent`', () => {
      const component = ResponseDetailsComponent({ trace });
      expect(component).toBeNull();
    });
  });

  describe('requests which do not satisfy any currently registered system', () => {
    const mockTrace = mockTraces[0];
    const trace = {
      ...mockTrace,
      id: 'other_id',
      http: {
        ...mockTrace.http,
        host: 'www.other.com',
        path: '/other?query=other',
        requestBody: 'other_request_body',
        responseBody: 'other_response_body',
      },
    } as Trace;

    it('should return correct value for `getSystemIconPath`', () => {
      const result = getIconUri(trace);
      expect(result).toEqual('default_icon');
    });

    it('should return correct value for `getRequestBody`', () => {
      const result = getRequestBody(trace);
      expect(result).toEqual('default_other_request_body_other_id');
    });

    it('should return correct value for `getResponseBody`', () => {
      const result = getResponseBody(trace);
      expect(result).toEqual('default_other_response_body_other_id');
    });

    it('should return correct data in the `ListDataComponent`', () => {
      const component = ListDataComponent({ trace });
      const { container } = render(component as ReactElement);
      expect(container).toHaveTextContent('default_icon | www.other.com | /other | query=other');
    });

    it('should return correct `SystemRequestDetailsComponent`', () => {
      const component = RequestDetailsComponent({ trace });
      expect(component).toBeNull();
    });

    it('should return correct `SystemResponseDetailsComponent`', () => {
      const component = ResponseDetailsComponent({ trace });
      expect(component).toBeNull();
    });
  });
});
