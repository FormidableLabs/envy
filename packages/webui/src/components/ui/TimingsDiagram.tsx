import { HttpRequest } from '@envyjs/core';

import { numberFormat, tw } from '@/utils';

type TimingsData = {
  name: string;
  color: string;
  duration: number;
  percentage: number;
  offset: number;
};

type TimingsDiagramProps = {
  timings: HttpRequest['timings'];
};

function calculateOffsets(data: TimingsData[]): TimingsData[] {
  const dataWithOffsets: TimingsData[] = [];

  let currentOffset = 0;
  for (const timing of data) {
    dataWithOffsets.push({ ...timing, offset: currentOffset });
    currentOffset += timing.percentage;
  }

  return dataWithOffsets;
}

export default function TimingsDiagram({ timings }: TimingsDiagramProps) {
  if (!timings) return null;

  const { blocked, dns, ssl, connect, send, wait, receive } = timings;

  const connecting = ssl === -1 ? connect : connect - ssl;

  // don't include SSL in total since it is included in the connect duration
  const total = blocked + dns + connect + send + wait + receive;

  const data = [
    { name: 'Blocked', color: 'bg-red-300', duration: blocked, percentage: blocked / total, offset: 0 },
    { name: 'DNS', color: 'bg-purple-300', duration: dns, percentage: dns / total, offset: 0 },
    { name: 'Connecting', color: 'bg-orange-300', duration: connecting, percentage: connecting / total, offset: 0 },
    { name: 'TLS setup', color: 'bg-amber-300', duration: ssl, percentage: ssl / total, offset: 0 },
    { name: 'Sending', color: 'bg-blue-300', duration: send, percentage: send / total, offset: 0 },
    { name: 'Waiting', color: 'bg-indigo-300', duration: wait, percentage: wait / total, offset: 0 },
    { name: 'Receiving', color: 'bg-green-300', duration: receive, percentage: receive / total, offset: 0 },
  ].filter(x => x.duration >= 0);

  const presentationData = calculateOffsets(data);

  return (
    <div className="w-full bg-slate-100 p-4 rounded">
      <table className="w-full">
        {presentationData.map(({ name, color, duration, offset, percentage }) => (
          <tr key={name}>
            <th className="w-[15%] font-normal text-left">{name}</th>
            <td>
              <div
                className={tw('relative h-8 text-sm', color)}
                style={{
                  marginLeft: `${offset * 100}%`,
                  width: `${percentage * 100}%`,
                }}
              >
                <div
                  className={tw(
                    'absolute top-[50%] -translate-y-1/2 opacity-75',
                    offset > 0.7 ? 'right-2' : 'left-[calc(100%+theme(space.2))]',
                  )}
                >
                  {numberFormat(duration)}ms
                </div>
              </div>
            </td>
          </tr>
        ))}
      </table>
    </div>
  );
}

/*
<Field label="Timing">
  <Fields>
    <Field label="Queuing">{numberFormat(trace.http.timings.blocked)} ms</Field>
    <Field label="DNS Lookup">{numberFormat(trace.http.timings.dns)} ms</Field>
    <Field label="Connecting">
      {numberFormat(
        trace.http.timings.ssl === -1
          ? trace.http.timings.connect
          : trace.http.timings.connect - trace.http.timings.ssl,
      )}{' '}
      ms
    </Field>
    <Field label="SSL">{numberFormat(trace.http.timings.ssl)} ms</Field>
    <Field label="Sending">{numberFormat(trace.http.timings.send)} ms</Field>
    <Field label="Waiting">{numberFormat(trace.http.timings.wait)} ms</Field>
    <Field label="Receiving">{numberFormat(trace.http.timings.receive)} ms</Field>
  </Fields>
</Field>
*/
