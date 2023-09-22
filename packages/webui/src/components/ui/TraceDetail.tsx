import { useCallback, useEffect, useRef } from 'react';

import { Code, DateTime, Field, Fields, JsonDisplay, Loading, Section, XmlDisplay } from '@/components';
import useApplication from '@/hooks/useApplication';
import {
  SystemRequestDetailsComponent,
  SystemResponseDetailsComponent,
  getIconPath,
  getRequestBody,
  getResponseBody,
} from '@/systems';
import { getHeader, numberFormat, pathAndQuery } from '@/utils';

import QueryParams from './QueryParams';
import RequestHeaders from './RequestHeaders';
import ResponseHeaders from './ResponseHeaders';

type CodeDisplayProps = {
  contentType: string | null;
  children: any;
};
type DetailProps = React.HTMLAttributes<HTMLElement>;

function CodeDisplay({ contentType, children, ...props }: CodeDisplayProps) {
  if (!children) return null;

  const isJson =
    contentType?.includes('application/json') || contentType?.includes('application/graphql-response+json');
  const isXml = contentType?.includes('application/xml');

  return (
    <Field label="Body" {...props}>
      {isJson ? (
        <JsonDisplay>{children}</JsonDisplay>
      ) : isXml ? (
        <XmlDisplay>{children}</XmlDisplay>
      ) : (
        <Code>{children}</Code>
      )}
    </Field>
  );
}

export default function TraceDetail({ className }: DetailProps) {
  const { getSelectedTrace, clearSelectedTrace } = useApplication();
  const trace = getSelectedTrace();

  const { http, serviceName, timestamp } = trace || {};
  const { method, host, url, requestHeaders, statusCode, statusMessage, responseHeaders, duration } = http || {};

  const responseComplete = duration !== undefined && statusCode !== undefined;

  const updateTimer = useCallback(() => {
    if (counterElRef.current) {
      const elapsedReqTime = Date.now() - timestamp!;
      counterElRef.current.textContent = `${numberFormat(elapsedReqTime)}ms`;
    }
  }, [timestamp]);

  const counterRef = useRef<NodeJS.Timeout>();

  const counterElRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    /* istanbul ignore next */
    if (!responseComplete) {
      counterRef.current = setInterval(updateTimer, 50);
      return () => counterRef.current && clearInterval(counterRef.current);
    } else if (counterRef.current) {
      clearInterval(counterRef.current);
    }
  }, [responseComplete, updateTimer]);

  if (!trace) return null;

  const [path] = pathAndQuery(trace);
  const requestBody = getRequestBody(trace);
  const responseBody = getResponseBody(trace);

  function statusCodeStyle(code: number) {
    let style = 'bg-transparent';
    if (code >= 500) style = 'bg-purple-500';
    else if (code >= 400) style = 'bg-red-500';
    else if (code >= 300) style = 'bg-yellow-500';
    else if (code >= 200) style = 'bg-green-500';
    return `inline-block rounded-full h-3 w-3 ${style}`;
  }

  return (
    <div className={`relative h-full overflow-y-scroll bg-slate-200 ${className}`}>
      <div className="sticky top-0 z-10">
        <Section collapsible={false} title="Request" />
        <button
          data-test-id="close-trace"
          className="absolute top-1 md:top-2 right-6 text-xl text-black"
          onClick={() => clearSelectedTrace()}
        >
          &#10006;
        </button>
      </div>

      <div data-test-id="summary" className="p-default">
        <div className="flex flex-row">
          <div className="flex-0 mr-2 md:mr-4">
            <img src={getIconPath(trace)} alt="" className="w-6 h-6 md:w-12 md:h-12" />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="break-all">
              <span className="flex justify-between items-center">
                <span data-test-id="method" className="font-bold">
                  {method}
                </span>
                {responseComplete && (
                  <span data-test-id="status" className="flex items-center gap-2">
                    <span className={statusCodeStyle(statusCode)}></span>
                    {`${statusCode} ${statusMessage}`}
                  </span>
                )}
              </span>
              <span data-test-id="url" className="block text-opacity-70 text-black">
                {url}
              </span>
            </div>
            <div data-test-id="service" className="mt-4">
              Sent from <span className="font-bold">{serviceName}</span>
            </div>
          </div>
        </div>
      </div>

      <Section data-test-id="request-details" title="Request details">
        <Fields>
          <Field data-test-id="sent" label="Sent">
            <DateTime time={timestamp} />
          </Field>
          <Field data-test-id="host" label="Host">
            {host}
          </Field>
          <Field data-test-id="path" label="Path">
            <span className="break-all">{path}</span>
          </Field>
          <CodeDisplay data-test-id="body" contentType={getHeader(requestHeaders, 'content-type')}>
            {requestBody}
          </CodeDisplay>
          <QueryParams data-test-id="query-params" trace={trace} />
          <RequestHeaders data-test-id="headers" trace={trace} />
        </Fields>
        <SystemRequestDetailsComponent data-test-id="system-specific" trace={trace} />
      </Section>

      <Section data-test-id="response-details" title="Response details">
        {responseComplete ? (
          <>
            <Fields data-test-id="response-fields">
              <Field data-test-id="received" label="Received">
                <DateTime time={timestamp! + duration} />
              </Field>
              <Field data-test-id="status" label="Status">
                {statusCode} {statusMessage}
              </Field>
              <Field data-test-id="duration" label="Duration">
                {numberFormat(duration)}ms
              </Field>
              <ResponseHeaders data-test-id="headers" trace={trace} />
            </Fields>
            <SystemResponseDetailsComponent data-test-id="system-specific" trace={trace} />
          </>
        ) : (
          <span className="flex flex-col my-20 mx-auto items-center">
            <Loading data-test-id="loading" className="animate-pulse" size={32} />
            <span data-test-id="duration" className="mt-2 font-mono" ref={counterElRef}></span>
          </span>
        )}
      </Section>

      {responseComplete && (
        <Section data-test-id="response-body" title="Response body">
          <Fields>
            <Field data-test-id="content-type" label="Type">
              {getHeader(responseHeaders, 'content-type')}
            </Field>
            <Field data-test-id="content-length" label="Length">
              {getHeader(responseHeaders, 'content-length')}
            </Field>
            <CodeDisplay data-test-id="body" contentType={getHeader(responseHeaders, 'content-type')}>
              {responseBody}
            </CodeDisplay>
          </Fields>
        </Section>
      )}
    </div>
  );
}
