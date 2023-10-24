import { HttpRequestState } from '@envyjs/core';
import { useCallback, useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';

import { Code, DateTime, Field, Fields, IconButton, JsonDisplay, Loading, Section, XmlDisplay } from '@/components';
import useApplication from '@/hooks/useApplication';
import {
  RequestDetailsComponent,
  ResponseDetailsComponent,
  getIconUri,
  getRequestBody,
  getResponseBody,
} from '@/systems';
import { getHeader, numberFormat, pathAndQuery } from '@/utils';

import CopyAsCurlButton from './CopyAsCurlButton';
import QueryParams from './QueryParams';
import RequestHeaders from './RequestHeaders';
import ResponseHeaders from './ResponseHeaders';
import { TabContent, TabList, TabListItem } from './Tabs';
import TimingsDiagram from './TimingsDiagram';

type CodeDisplayProps = {
  contentType: string | string[] | null;
  children: any;
};

function CodeDisplay({ contentType, children, ...props }: CodeDisplayProps) {
  if (!children) return null;

  const type = Array.isArray(contentType) ? contentType[0] : contentType;
  const isJson = type?.includes('application/json') || contentType?.includes('application/graphql-response+json');
  const isXml = contentType?.includes('application/xml');

  return (
    <div className="h-full" {...props}>
      {isJson ? (
        <JsonDisplay>{children}</JsonDisplay>
      ) : isXml ? (
        <XmlDisplay>{children}</XmlDisplay>
      ) : (
        <Code>{children}</Code>
      )}
    </div>
  );
}

export default function TraceDetail() {
  const { getSelectedTrace, clearSelectedTrace } = useApplication();
  const trace = getSelectedTrace();

  const { http, serviceName, timestamp } = trace || {};
  const { method, host, url, requestHeaders, statusCode, statusMessage, responseHeaders, duration, state } = http || {};

  const responseComplete = state !== HttpRequestState.Sent;

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
    else if (code === -1) style = 'bg-gray-500';
    return `inline-block rounded-full h-3 w-3 ${style}`;
  }

  return (
    <div className="h-full flex flex-col bg-secondary">
      <div className="sticky top-0">
        <div data-test-id="summary" className="p-default mb-4">
          <div className="flex flex-row">
            <div className="flex-0 mr-2 md:mr-4">
              <img src={getIconUri(trace)} alt="" className="w-6 h-6 md:w-12 md:h-12" />
            </div>
            <div className="flex-1 flex flex-col">
              <div className="break-all">
                <span className="flex justify-between items-center">
                  <span data-test-id="method" className="font-bold">
                    {method}
                  </span>
                  <span className="flex items-center gap-2">
                    <CopyAsCurlButton data-test-id="copy-as-curl" trace={trace} />
                    <IconButton
                      Icon={HiX}
                      onClick={() => clearSelectedTrace()}
                      className="py-2.5"
                      data-test-id="close-trace"
                    />
                  </span>
                </span>
                <span data-test-id="url" className="block">
                  {url}
                </span>
              </div>
              <div data-test-id="service" className="mt-2">
                Sent from <span className="font-bold">{serviceName}</span>
              </div>
            </div>
          </div>
        </div>

        {responseComplete && statusCode && (
          <div data-test-id="response-status" className="absolute bottom-0 right-0 p-default flex items-center gap-2">
            <span className={statusCodeStyle(statusCode)}></span>
            {`${statusCode > -1 ? statusCode : ''} ${statusMessage}`}
          </div>
        )}

        <TabList>
          <TabListItem title="Headers" id="default" />
          {requestBody && <TabListItem title="Payload" id="payload" />}
          {responseBody && <TabListItem title="Response" id="response" />}
        </TabList>
      </div>

      <div className="overflow-hidden overflow-y-auto h-full" data-test-id="trace-detail">
        <TabContent id="default">
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

              <QueryParams data-test-id="query-params" trace={trace} />
              <RequestHeaders data-test-id="headers" trace={trace} />
            </Fields>
            <RequestDetailsComponent data-test-id="system-specific" trace={trace} />
          </Section>

          <Section data-test-id="response-details" title="Response details">
            {responseComplete && duration ? (
              <>
                <Fields data-test-id="response-fields">
                  <Field data-test-id="received" label="Received">
                    <DateTime time={timestamp! + duration} />
                  </Field>
                  <Field data-test-id="status" label="Status">
                    {statusCode && statusCode > -1 ? statusCode : ''} {statusMessage}
                  </Field>
                  <ResponseHeaders data-test-id="headers" trace={trace} />
                  <Field data-test-id="duration" label="Duration">
                    {numberFormat(duration)}ms
                  </Field>
                  {trace.http?.timingsBlockedByCors && (
                    <Field data-test-id="timings-blocked" label="Timings">
                      <a
                        href="https://github.com/FormidableLabs/envy#web-client-application"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Disabled by CORS policy
                      </a>
                    </Field>
                  )}
                  {trace.http?.timings && (
                    <Field data-test-id="timings" label="Timings">
                      <TimingsDiagram timings={trace.http.timings} />
                    </Field>
                  )}
                </Fields>
                <ResponseDetailsComponent data-test-id="system-specific" trace={trace} />
              </>
            ) : (
              <span className="flex flex-col my-20 mx-auto items-center">
                <Loading data-test-id="loading" className="animate-pulse" size={32} />
                <span data-test-id="duration" className="mt-2 font-mono" ref={counterElRef}></span>
              </span>
            )}
          </Section>
        </TabContent>

        <TabContent id="payload">
          <CodeDisplay data-test-id="request-body" contentType={getHeader(requestHeaders, 'content-type')}>
            {requestBody}
          </CodeDisplay>
        </TabContent>

        <TabContent id="response">
          {responseComplete && (
            <CodeDisplay data-test-id="response-body" contentType={getHeader(responseHeaders, 'content-type')}>
              {responseBody}
            </CodeDisplay>
          )}
        </TabContent>
      </div>
    </div>
  );
}
