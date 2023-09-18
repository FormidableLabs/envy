import { useCallback, useEffect, useRef } from 'react';

import { Code, DateTime, Field, Fields, JsonDisplay, Loading, Section, XmlDisplay } from '@/components/ui';
import useApplication from '@/hooks/useApplication';
import {
  SystemRequestDetailsComponent,
  SystemResponseDetailsComponent,
  getRequestBody,
  getResponseBody,
  getSystemIconPath,
} from '@/systems';
import { getHeader, numberFormat, pathAndQuery } from '@/utils';

import { QueryParams, RequestHeaders, ResponseHeaders } from './KeyValueList';

type CodeDisplayProps = {
  contentType: string | null;
  children: any;
};
type DetailProps = React.HTMLAttributes<HTMLElement>;

function CodeDisplay({ contentType, children }: CodeDisplayProps) {
  if (!children) return null;

  const isJson =
    contentType?.includes('application/json') || contentType?.includes('application/graphql-response+json');
  const isXml = contentType?.includes('application/xml');

  return (
    <Field label="Body">
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

  const {
    serviceName,
    timestamp,
    method,
    host,
    url,
    requestHeaders,
    statusCode,
    statusMessage,
    responseHeaders,
    duration,
  } = trace || {};
  const responseComplete = duration !== undefined && statusCode !== undefined;

  const updateTimer = useCallback(() => {
    if (timestamp === undefined) return;

    if (counterElRef.current) {
      const elapsedReqTime = Date.now() - timestamp;
      counterElRef.current.textContent = `${numberFormat(elapsedReqTime)}ms`;
    }
  }, [timestamp]);

  const counterRef = useRef<NodeJS.Timeout>();

  const counterElRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
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

  function statusCodeStyle() {
    let style = 'bg-transparent';
    if (!statusCode) style = 'bg-transparent';
    else if (statusCode >= 500) style = 'bg-purple-500';
    else if (statusCode >= 400) style = 'bg-red-500';
    else if (statusCode >= 300) style = 'bg-yellow-500';
    else if (statusCode >= 200) style = 'bg-green-500';
    return `inline-block rounded-full h-3 w-3 ${style}`;
  }

  return (
    <div className={`relative h-full overflow-y-scroll bg-slate-200 ${className}`}>
      <div className="sticky top-0 z-10">
        <Section collapsible={false} title="Request" />
        <button className="absolute top-1 md:top-2 right-6 text-xl text-black" onClick={() => clearSelectedTrace()}>
          &#10006;
        </button>
      </div>

      <div className="p-default">
        <div className="flex flex-row">
          <div className="flex-0 mr-2 md:mr-4">
            <img src={getSystemIconPath(trace)} alt="" className="w-6 h-6 md:w-12 md:h-12" />
          </div>
          <div className="flex-1 flex flex-col">
            <div className="break-all">
              <span className="flex justify-between items-center">
                <span className="font-bold">{method}</span>
                {responseComplete && (
                  <span className="flex items-center gap-2">
                    <span className={statusCodeStyle()}></span>
                    {`${statusCode} ${statusMessage}`}
                  </span>
                )}
              </span>
              <span className="block text-opacity-70 text-black">{url}</span>
            </div>
            <div className="mt-4">
              Sent from <span className="font-bold">{serviceName}</span>
            </div>
          </div>
        </div>
      </div>

      <Section title="Request details">
        <Fields>
          <Field label="Sent">
            <DateTime time={timestamp} />
          </Field>
          <Field label="Host">{host}</Field>
          <Field label="Path">
            <span className="break-all">{path}</span>
          </Field>
          <CodeDisplay contentType={getHeader(requestHeaders, 'content-type')}>{requestBody}</CodeDisplay>
          <QueryParams trace={trace} />
          <RequestHeaders trace={trace} />
        </Fields>
        <SystemRequestDetailsComponent trace={trace} />
      </Section>

      <Section title="Response details">
        {responseComplete ? (
          <>
            <Fields>
              <Field label="Received">
                <DateTime time={timestamp} />
              </Field>
              <Field label="Status">
                {statusCode} {statusMessage}
              </Field>
              <Field label="Duration">{numberFormat(duration)}ms</Field>
              <ResponseHeaders trace={trace} />
            </Fields>
            <SystemResponseDetailsComponent trace={trace} />
          </>
        ) : (
          <span className="flex flex-col my-20 mx-auto items-center">
            <Loading className="animate-pulse" size={32} />
            <span className="mt-2 font-mono" ref={counterElRef}></span>
          </span>
        )}
      </Section>
      {responseComplete && (
        <Section title="Response body">
          <Fields>
            <Field label="Type">{getHeader(responseHeaders, 'content-type')}</Field>
            <Field label="Length">{getHeader(responseHeaders, 'content-length')}</Field>
            <CodeDisplay contentType={getHeader(responseHeaders, 'content-type')}>{responseBody}</CodeDisplay>
          </Fields>
        </Section>
      )}
    </div>
  );
}
