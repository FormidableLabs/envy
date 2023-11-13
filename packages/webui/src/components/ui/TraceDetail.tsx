import { HttpRequestState } from '@envyjs/core';
import { X } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

import { Badge, Button, CodeDisplay, DateTime, Field, Fields, Loading, Section } from '@/components';
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

const TabMap = {
  default: 'default',
  payload: 'payload',
  response: 'response',
};

export default function TraceDetail() {
  const { getSelectedTrace, clearSelectedTrace, selectedTab, setSelectedTab } = useApplication();
  const trace = getSelectedTrace();

  const { http, serviceName, timestamp } = trace || {};
  const { method, host, url, requestHeaders, statusCode, statusMessage, responseHeaders, duration, state } = http || {};
  const requestAborted = state === HttpRequestState.Aborted;
  const responseComplete = state !== HttpRequestState.Sent;
  const showResponseHeaders = state === HttpRequestState.Received;

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
  const httpStatusLabel = `${statusCode && statusCode > -1 ? statusCode : ''} ${statusMessage}`;

  // handle persistent tabs
  const availableTabs = [TabMap.default];
  if (requestBody) {
    availableTabs.push(TabMap.payload);
  }
  if (responseBody) {
    availableTabs.push(TabMap.response);
  }
  if (!availableTabs.includes(selectedTab)) {
    setSelectedTab(TabMap.default);
    window.history.replaceState('', '', `#${TabMap.default}`);
  }

  return (
    <div className="h-full flex flex-col p-default bg-secondary">
      <div className="sticky top-0" data-test-id="summary">
        <div className="flex flex-row gap-2 items-center">
          <div className="flex-1 flex flex-row gap-2">
            <div>
              <img src={getIconUri(trace)} alt="" className="w-7 h-7" />
            </div>
            <Badge>{method}</Badge>
            {requestAborted && (
              <Badge className="bg-gray-500 uppercase" data-test-id="aborted-indicator">
                Aborted
              </Badge>
            )}
            {statusCode && (
              <Badge className={statusCodeStyle(statusCode)} data-test-id="method">
                {httpStatusLabel}
              </Badge>
            )}
            <Badge>{serviceName}</Badge>
          </div>
          <div className="flex flex-row gap-1">
            <CopyAsCurlButton data-test-id="copy-as-curl" trace={trace} />
            <Button Icon={X} onClick={() => clearSelectedTrace()} border="none" data-test-id="close-trace" />
          </div>
        </div>

        <div className="mt-2 mb-4 break-all font-mono" data-test-id="url">
          {url}
        </div>

        <TabList>
          <TabListItem title="Details" id="default" />
          {availableTabs.includes(TabMap.payload) && <TabListItem title="Payload" id={TabMap.payload} />}
          {availableTabs.includes(TabMap.response) && <TabListItem title="Response" id={TabMap.response} />}
        </TabList>
      </div>

      <div className="overflow-hidden overflow-y-auto h-full" data-test-id="trace-detail">
        <TabContent id="default">
          <Section data-test-id="request-details" title="Request Details" className="border-t-0">
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
            </Fields>
            <RequestDetailsComponent data-test-id="system-specific" trace={trace} />
          </Section>

          <QueryParams data-test-id="query-params" trace={trace} />

          <Section data-test-id="request-details" title="Request Headers">
            <RequestHeaders data-test-id="headers" trace={trace} />
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

                  <Field data-test-id="duration" label="Duration">
                    {numberFormat(duration)}ms
                  </Field>
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

          {showResponseHeaders && (
            <>
              <Section data-test-id="request-headers" title="Response Headers">
                <ResponseHeaders data-test-id="headers" trace={trace} />
              </Section>

              <Section data-test-id="request-headers" title="Timing">
                {trace.http?.timingsBlockedByCors && (
                  <div data-test-id="timings-blocked">
                    <a
                      href="https://github.com/FormidableLabs/envy#web-client-application"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Disabled by CORS policy
                    </a>
                  </div>
                )}
                {trace.http?.timings && (
                  <div data-test-id="timings">
                    <TimingsDiagram timings={trace.http.timings} />
                  </div>
                )}
              </Section>
            </>
          )}
        </TabContent>

        <TabContent id="payload">
          <CodeDisplay
            data-test-id="request-body"
            contentType={getHeader(requestHeaders, 'content-type')}
            data={requestBody}
          />
        </TabContent>

        <TabContent id="response">
          {responseComplete && (
            <CodeDisplay
              data-test-id="response-body"
              contentType={getHeader(responseHeaders, 'content-type')}
              data={responseBody}
            />
          )}
        </TabContent>
      </div>
    </div>
  );
}

function statusCodeStyle(code: number) {
  let style = 'bg-gray-500';
  if (code >= 500) style = 'bg-purple-500';
  else if (code >= 400) style = 'bg-red-500';
  else if (code >= 300) style = 'bg-yellow-500';
  else if (code >= 200) style = 'bg-green-500';
  return style;
}
