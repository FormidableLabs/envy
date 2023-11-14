import { HttpRequestState } from '@envyjs/core';
import { act, cleanup, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import {
  RequestDetailsComponent,
  ResponseDetailsComponent,
  getIconUri,
  getRequestBody,
  getResponseBody,
} from '@/systems';
import mockTraces from '@/testing/mockTraces';
import { setUseApplicationData } from '@/testing/mockUseApplication';
import { Trace } from '@/types';

import TraceDetail from './TraceDetail';

jest.mock('@/components', () => ({
  Badge: function ({ children }: any) {
    return <>Mock Badge component: {children}</>;
  },
  Code: function ({ children }: any) {
    return <>Mock Code component: {children}</>;
  },
  DateTime: function ({ time }: any) {
    return <>Mock DateTime component: {time}</>;
  },
  Field: function (props: any) {
    return <div {...props} />;
  },
  Fields: function (props: any) {
    return <div {...props} />;
  },
  CodeDisplay: function ({ children }: any) {
    return <>Mock CodeDisplay component: {children}</>;
  },
  Loading: function (props: any) {
    return <div {...props}>Mock Loading component</div>;
  },
  Section: function ({ collapsible, ...safeProps }: any) {
    return <div {...safeProps} />;
  },
  XmlDisplay: function ({ children }: any) {
    return <>Mock XmlDisplay component: {children}</>;
  },
  Button: function ({ children, Icon, ...props }: any) {
    return <div {...props}>Mock Button component: {children}</div>;
  },
}));

jest.mock(
  '@/components/ui/CopyAsCurlButton',
  () =>
    function CopyAsCurlButton({ trace, ...props }: any) {
      return <div {...props}>Mock CopyAsCurlButton component: {trace.id}</div>;
    },
);
jest.mock(
  '@/components/ui/QueryParams',
  () =>
    function MockQueryParams({ trace, ...props }: any) {
      return <div {...props}>Mock QueryParams component: {trace.id}</div>;
    },
);
jest.mock(
  '@/components/ui/RequestHeaders',
  () =>
    function MockRequestHeaders({ trace, ...props }: any) {
      return <div {...props}>Mock RequestHeaders component: {trace.id}</div>;
    },
);
jest.mock(
  '@/components/ui/ResponseHeaders',
  () =>
    function MockResponseHeaders({ trace, ...props }: any) {
      return <div {...props}>Mock ResponseHeaders component: {trace.id}</div>;
    },
);
jest.mock(
  '@/components/ui/TimingsDiagram',
  () =>
    function MockTimingsDiagram({ timings, ...props }: any) {
      return <div {...props}>Mock TimingsDiagram component: {JSON.stringify(timings)}</div>;
    },
);

jest.mock('@/systems');

type MockTraceType = Omit<Trace, 'http'> & {
  http?: Partial<Trace['http']>;
};

const mockTrace = mockTraces[0];

describe('TraceDetail', () => {
  let getSelectedTraceFn: jest.Mock<MockTraceType | undefined>;
  let clearSelectedTraceFn: jest.Mock;

  beforeEach(() => {
    getSelectedTraceFn = jest.fn();
    getSelectedTraceFn.mockReturnValue(mockTrace);
    clearSelectedTraceFn = jest.fn();

    // having to do this here, like this, so that we can override some of the mock return values later
    jest.mocked(RequestDetailsComponent).mockImplementation(({ trace, ...props }: any) => {
      return <div {...props}>Mock SystemRequestDetailsComponent component: {trace.id}</div>;
    });
    jest.mocked(ResponseDetailsComponent).mockImplementation(({ trace, ...props }: any) => {
      return <div {...props}>Mock SystemResponseDetailsComponent component: {trace.id}</div>;
    });
    jest.mocked(getRequestBody).mockReturnValue('mock_request_body');
    jest.mocked(getResponseBody).mockReturnValue('mock_response_body');
    jest.mocked(getIconUri).mockReturnValue('mock_icon.jpg');

    setUseApplicationData({
      getSelectedTrace: getSelectedTraceFn as () => Trace,
      clearSelectedTrace: clearSelectedTraceFn,
    });
  });

  afterEach(() => {
    cleanup();
  });

  fit('should render without error', () => {
    render(<TraceDetail />);
  });

  it('should not render anything if there is no selected trace', () => {
    getSelectedTraceFn.mockReturnValue(undefined);

    const { container } = render(<TraceDetail />);
    expect(container).toBeEmptyDOMElement();
  });

  describe('summary data', () => {
    it('should display summary', () => {
      const { getByTestId } = render(<TraceDetail />);

      const summary = getByTestId('summary');
      expect(summary).toBeVisible();
    });

    it('should display icon image', () => {
      const { getByTestId } = render(<TraceDetail />);

      const summary = getByTestId('summary');
      const image = within(summary).getByRole('img');

      expect(image).toBeVisible();
      expect(image).toHaveAttribute('src', 'mock_icon.jpg');
    });

    it('should display HTTP method used', () => {
      getSelectedTraceFn.mockReturnValue({
        ...mockTrace,
        http: {
          ...mockTrace.http,
          method: 'PATCH',
        },
      });

      const { getByTestId } = render(<TraceDetail />);

      const summary = getByTestId('summary');
      const method = within(summary).getByTestId('method');

      expect(method).toBeVisible();
      expect(method).toHaveTextContent('PATCH');
    });

    it('should not display HTTP status code or message is there is no response', () => {
      getSelectedTraceFn.mockReturnValue({
        ...mockTrace,
        http: {
          ...mockTrace.http,
          method: 'PATCH',
          statusCode: undefined,
          statusMessage: undefined,
          responseHeaders: undefined,
          responseBody: undefined,
          duration: undefined,
        },
      });

      const { getByTestId } = render(<TraceDetail />);

      const summary = getByTestId('summary');
      const status = within(summary).queryByTestId('status');

      expect(status).not.toBeInTheDocument();
    });

    it('should display aborted indicator when request is aborted', () => {
      const mockAbortedTrace = mockTraces.find(trace => trace.http?.state === HttpRequestState.Aborted);
      getSelectedTraceFn.mockReturnValue(mockAbortedTrace);

      const { getByTestId } = render(<TraceDetail />);

      const summary = getByTestId('summary');
      const abortedIndicator = within(summary).queryByTestId('aborted-indicator');

      expect(abortedIndicator).toBeInTheDocument();
    });

    it('should not display aborted indicator when response is received', () => {
      const mockAbortedTrace = mockTraces.find(trace => trace.http?.state === HttpRequestState.Received);
      getSelectedTraceFn.mockReturnValue(mockAbortedTrace);

      const { getByTestId } = render(<TraceDetail />);

      const summary = getByTestId('summary');
      const abortedIndicator = within(summary).queryByTestId('aborted-indicator');

      expect(abortedIndicator).not.toBeInTheDocument();
    });

    it('should display full URL', () => {
      getSelectedTraceFn.mockReturnValue({
        ...mockTrace,
        http: {
          ...mockTrace.http,
          url: 'https://www.example.com/foo/bar',
        },
      });
      const { getByTestId } = render(<TraceDetail />);

      const summary = getByTestId('summary');
      const url = within(summary).getByTestId('url');

      expect(url).toBeVisible();
      expect(url).toHaveTextContent('https://www.example.com/foo/bar');
    });

    it('should display origin service', () => {
      getSelectedTraceFn.mockReturnValue({
        ...mockTrace,
        serviceName: 'my-service',
        http: {
          ...mockTrace.http,
          method: 'PATCH',
          statusCode: 204,
          statusMessage: 'No Content',
          responseHeaders: {},
          responseBody: '',
          duration: 1234,
        },
      });

      const { getByTestId } = render(<TraceDetail />);

      const summary = getByTestId('summary');
      const service = within(summary).getByTestId('service');

      expect(service).toBeVisible();
      expect(service).toHaveTextContent('Sent from my-service');
    });

    it('should display button to copy as cURL snippet', () => {
      getSelectedTraceFn.mockReturnValue({
        ...mockTrace,
        serviceName: 'my-service',
        http: {
          ...mockTrace.http,
          method: 'PATCH',
          statusCode: 204,
          statusMessage: 'No Content',
          responseHeaders: {},
          responseBody: '',
          duration: 1234,
        },
      });

      const { getByTestId } = render(<TraceDetail />);

      const summary = getByTestId('summary');
      const copyAsCurl = within(summary).getByTestId('copy-as-curl');

      expect(copyAsCurl).toBeVisible();
      expect(copyAsCurl).toHaveTextContent('Mock CopyAsCurlButton component: 2');
    });

    it.each([
      { statusCode: 500, color: 'purple-500' },
      { statusCode: 400, color: 'red-500' },
      { statusCode: 300, color: 'yellow-500' },
      { statusCode: 200, color: 'green-500' },
    ])('should display a $color circle next to the status code for HTTP $statusCode', ({ statusCode, color }) => {
      getSelectedTraceFn.mockReturnValue({
        ...mockTrace,
        http: {
          ...mockTrace.http,
          statusCode,
        },
      });

      const { getByTestId } = render(<TraceDetail />);

      const status = getByTestId('response-status');
      const statusCodeCircle = status.firstChild;

      expect(statusCodeCircle).toHaveClass(`bg-${color}`);
    });
  });

  describe('request details', () => {
    it('should display "Request details" section', () => {
      const { getByTestId } = render(<TraceDetail />);

      const requestDetails = getByTestId('request-details');
      expect(requestDetails).toBeVisible();
    });

    it('should display time request was sent', () => {
      const timestamp = 1695308938;
      getSelectedTraceFn.mockReturnValue({
        ...mockTrace,
        timestamp,
        http: {
          ...mockTrace.http,
        },
      });

      const { getByTestId } = render(<TraceDetail />);

      const requestDetails = getByTestId('request-details');
      const sent = within(requestDetails).getByTestId('sent');

      expect(sent).toBeVisible();
      expect(sent).toHaveTextContent(`Mock DateTime component: ${1695308938}`);
    });

    it('should display request host', () => {
      getSelectedTraceFn.mockReturnValue({
        ...mockTrace,
        http: {
          ...mockTrace.http,
          host: 'www.example.com',
        },
      });

      const { getByTestId } = render(<TraceDetail />);

      const requestDetails = getByTestId('request-details');
      const host = within(requestDetails).getByTestId('host');

      expect(host).toBeVisible();
      expect(host).toHaveTextContent('www.example.com');
    });

    it('should display request path', () => {
      getSelectedTraceFn.mockReturnValue({
        ...mockTrace,
        http: {
          ...mockTrace.http,
          path: '/foo/bar',
        },
      });

      const { getByTestId } = render(<TraceDetail />);

      const requestDetails = getByTestId('request-details');
      const path = within(requestDetails).getByTestId('path');

      expect(path).toBeVisible();
      expect(path).toHaveTextContent('/foo/bar');
    });

    it.each([
      {
        contentType: 'application/json',
        component: 'JsonDisplay',
        content: 'Mock JsonDisplay component: mock_request_body',
      },
      {
        contentType: 'application/graphql-response+json',
        component: 'JsonDisplay',
        content: 'Mock JsonDisplay component: mock_request_body',
      },
      {
        contentType: 'application/xml',
        component: 'XmlDisplay',
        content: 'Mock XmlDisplay component: mock_request_body',
      },
      {
        contentType: 'text/text',

        component: 'Code',
        content: 'Mock Code component: mock_request_body',
      },
    ])(
      'should render $component component for request body when content type is $contentType',
      ({ contentType, content }) => {
        getSelectedTraceFn.mockReturnValue({
          ...mockTrace,
          http: {
            ...mockTrace.http,
            requestHeaders: {
              'content-type': contentType,
            },
          },
        });

        const { getByTestId } = render(<TraceDetail />);

        const requestDetails = getByTestId('trace-detail');
        const body = within(requestDetails).getByTestId('request-body');

        expect(body).toBeVisible();
        expect(body).toHaveTextContent(content);
      },
    );

    it('should not render anything for the body if the body is empty', () => {
      jest.mocked(getRequestBody).mockReturnValue(undefined);

      const { getByTestId } = render(<TraceDetail />);

      const requestDetails = getByTestId('trace-detail');
      const body = within(requestDetails).queryByTestId('body');
      expect(body).not.toBeInTheDocument();
    });

    it('should render QueryParams component for trace query params', () => {
      const { getByTestId } = render(<TraceDetail />);

      const requestDetails = getByTestId('request-details');
      const queryParams = within(requestDetails).getByTestId('query-params');

      expect(queryParams).toBeVisible();
      expect(queryParams).toHaveTextContent(`Mock QueryParams component: ${mockTrace.id}`);
    });

    it('should render RequestHeaders component for trace headers', () => {
      const { getByTestId } = render(<TraceDetail />);

      const requestDetails = getByTestId('request-details');
      const headers = within(requestDetails).getByTestId('headers');

      expect(headers).toBeVisible();
      expect(headers).toHaveTextContent(`Mock RequestHeaders component: ${mockTrace.id}`);
    });

    it('should render SystemRequestDetailsComponent component for trace', () => {
      const { getByTestId } = render(<TraceDetail />);

      const requestDetails = getByTestId('request-details');
      const systemSpecific = within(requestDetails).getByTestId('system-specific');

      expect(systemSpecific).toBeVisible();
      expect(systemSpecific).toHaveTextContent(`Mock SystemRequestDetailsComponent component: ${mockTrace.id}`);
    });
  });

  describe('response details', () => {
    it('should display "Response details" section', () => {
      const { getByTestId } = render(<TraceDetail />);

      const responseDetails = getByTestId('response-details');
      expect(responseDetails).toBeVisible();
    });

    describe('with no response', () => {
      beforeEach(() => {
        getSelectedTraceFn.mockReturnValue({
          ...mockTrace,
          timestamp: Date.now() - 1000,
          http: {
            ...mockTrace.http,
            statusCode: undefined,
            statusMessage: undefined,
            responseHeaders: undefined,
            responseBody: undefined,
            duration: undefined,
          },
        });
      });

      it('should display Loading component if there is no response', () => {
        const { getByTestId } = render(<TraceDetail />);

        const responseDetails = getByTestId('response-details');
        const loading = within(responseDetails).getByTestId('loading');
        const responseFields = within(responseDetails).queryByTestId('resopnse-fields');

        expect(loading).toBeVisible();
        expect(loading).toHaveTextContent('Mock Loading component');

        expect(responseFields).not.toBeInTheDocument();
      });
    });

    describe('with response', () => {
      it('should display time request was recieved', () => {
        const timestamp = 1695308938;
        const duration = 1234;

        getSelectedTraceFn.mockReturnValue({
          ...mockTrace,
          timestamp,
          http: {
            ...mockTrace.http,
            duration,
          },
        });

        const { getByTestId } = render(<TraceDetail />);

        const responseDetails = getByTestId('response-details');
        const received = within(responseDetails).getByTestId('received');

        expect(received).toBeVisible();
        expect(received).toHaveTextContent(`Mock DateTime component: ${timestamp + duration}`);
      });

      it('should display status code and message', () => {
        getSelectedTraceFn.mockReturnValue({
          ...mockTrace,
          http: {
            ...mockTrace.http,
            statusCode: 204,
            statusMessage: 'No Content',
          },
        });

        const { getByTestId } = render(<TraceDetail />);

        const responseDetails = getByTestId('response-details');
        const status = within(responseDetails).getByTestId('status');

        expect(status).toBeVisible();
        expect(status).toHaveTextContent(`204 No Content`);
      });

      it('should render ResponseHeaders component for trace headers', () => {
        const { getByTestId } = render(<TraceDetail />);

        const responseDetails = getByTestId('response-details');
        const headers = within(responseDetails).getByTestId('headers');

        expect(headers).toBeVisible();
        expect(headers).toHaveTextContent(`Mock ResponseHeaders component: ${mockTrace.id}`);
      });

      it('should display request duration', () => {
        getSelectedTraceFn.mockReturnValue({
          ...mockTrace,
          http: {
            ...mockTrace.http,
            duration: 1234,
          },
        });

        const { getByTestId } = render(<TraceDetail />);

        const responseDetails = getByTestId('response-details');
        const duration = within(responseDetails).getByTestId('duration');

        expect(duration).toBeVisible();
        expect(duration).toHaveTextContent(`1,234ms`);
      });

      it('should not render TimingsDiagram component if there are no timings in the trace', () => {
        getSelectedTraceFn.mockReturnValue({
          ...mockTrace,
          http: {
            ...mockTrace.http,
            duration: 1234,
            timings: undefined,
          },
        });

        const { getByTestId } = render(<TraceDetail />);

        const responseDetails = getByTestId('response-details');
        const timings = within(responseDetails).queryByTestId('timings');

        expect(timings).not.toBeInTheDocument();
      });

      it('should render TimingsDiagram component if there are timings in the trace', () => {
        const timingsData = {
          blocked: 10,
          dns: 20,
          connect: 100,
          ssl: 70,
          send: 30,
          wait: 30,
          receive: 10,
        };
        getSelectedTraceFn.mockReturnValue({
          ...mockTrace,
          http: {
            ...mockTrace.http,
            duration: 1234,
            timings: timingsData,
          },
        });

        const { getByTestId } = render(<TraceDetail />);

        const responseDetails = getByTestId('response-details');
        const timings = within(responseDetails).getByTestId('timings');

        expect(timings).toBeVisible();
        expect(timings).toHaveTextContent(JSON.stringify(timingsData));
      });

      it('should indicate if timings are blocked by CORS', () => {
        getSelectedTraceFn.mockReturnValue({
          ...mockTrace,
          http: {
            ...mockTrace.http,
            duration: 1234,
            timingsBlockedByCors: true,
          },
        });

        const { getByTestId } = render(<TraceDetail />);

        const responseDetails = getByTestId('response-details');
        const timingsBlocked = within(responseDetails).getByTestId('timings-blocked');

        expect(timingsBlocked).toBeVisible();
        expect(timingsBlocked).toHaveTextContent('Disabled by CORS policy');
      });

      it('should render SystemResponseDetailsComponent component for trace headers', () => {
        const { getByTestId } = render(<TraceDetail />);

        const responseDetails = getByTestId('response-details');
        const systemSpecific = within(responseDetails).getByTestId('system-specific');

        expect(systemSpecific).toBeVisible();
        expect(systemSpecific).toHaveTextContent(`Mock SystemResponseDetailsComponent component: ${mockTrace.id}`);
      });
    });
  });

  describe('response body', () => {
    describe('with no response', () => {
      it('should not render a "Response body" section', () => {
        const traceWithoutResponse = {
          ...mockTrace,
          http: {
            ...mockTrace.http,
            state: HttpRequestState.Sent,
            statusCode: undefined,
            statusMessage: undefined,
            responseHeaders: undefined,
            responseBody: undefined,
            duration: undefined,
          },
        };

        getSelectedTraceFn.mockReturnValue(traceWithoutResponse);

        const { queryByTestId } = render(<TraceDetail />);

        const responseBody = queryByTestId('response-body');
        expect(responseBody).not.toBeInTheDocument();
      });
    });

    describe('with response', () => {
      it('should display "Response body" section', () => {
        const { getByTestId } = render(<TraceDetail />);

        const responseBody = getByTestId('response-body');
        expect(responseBody).toBeVisible();
      });

      it.each([
        {
          contentType: 'application/json',
          component: 'JsonDisplay',
          content: 'Mock JsonDisplay component: mock_response_body',
        },
        {
          contentType: 'application/graphql-response+json',
          component: 'JsonDisplay',
          content: 'Mock JsonDisplay component: mock_response_body',
        },
        {
          contentType: 'application/xml',
          component: 'XmlDisplay',
          content: 'Mock XmlDisplay component: mock_response_body',
        },
        {
          contentType: 'text/text',

          component: 'Code',
          content: 'Mock Code component: mock_response_body',
        },
      ])(
        'should render $component component for response body when content type is $contentType',
        ({ contentType, content }) => {
          getSelectedTraceFn.mockReturnValue({
            ...mockTrace,
            http: {
              ...mockTrace.http,
              responseHeaders: {
                'content-type': contentType,
              },
            },
          });

          const { getByTestId } = render(<TraceDetail />);

          const responseBody = getByTestId('trace-detail');
          const body = within(responseBody).queryByTestId('response-body');

          expect(body).toBeVisible();
          expect(body).toHaveTextContent(content);
        },
      );

      it('should not render anything for the body if the body is empty', () => {
        jest.mocked(getResponseBody).mockReturnValue(undefined);

        const { getByTestId } = render(<TraceDetail />);

        const responseBody = getByTestId('trace-detail');
        const body = within(responseBody).queryByTestId('response-body');

        expect(body).not.toBeInTheDocument();
      });
    });
  });

  describe('closing the trace details UI', () => {
    it('should display a button to close the trace UI', () => {
      const { getByTestId } = render(<TraceDetail />);

      const closeTrace = getByTestId('close-trace');
      expect(closeTrace).toBeVisible();
    });

    it('should call `clearSelectedTrace` when clicking the close button', async () => {
      const { getByTestId } = render(<TraceDetail />);

      const closeTrace = getByTestId('close-trace');

      await act(async () => {
        await userEvent.click(closeTrace);
      });

      expect(clearSelectedTraceFn).toHaveBeenCalled();
    });
  });

  describe('dynamic duration timer', () => {
    beforeEach(() => {
      jest.useFakeTimers();

      getSelectedTraceFn.mockReturnValue({
        ...mockTrace,
        timestamp: Date.now(),
        http: {
          ...mockTrace.http,
          state: HttpRequestState.Sent,
          statusCode: undefined,
          statusMessage: undefined,
          responseHeaders: undefined,
          responseBody: undefined,
          duration: undefined,
        },
      });
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should display elapsed time', () => {
      const { getByTestId } = render(<TraceDetail />);

      const responseDetails = getByTestId('response-details');
      const duration = within(responseDetails).getByTestId('duration');

      expect(duration).toHaveTextContent('');

      jest.advanceTimersByTime(1000);

      expect(duration).toHaveTextContent('1,000ms');

      jest.advanceTimersByTime(500);

      expect(duration).toHaveTextContent('1,500ms');
    });
  });
});
