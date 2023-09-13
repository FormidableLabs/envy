import { DEFAULT_WEB_SOCKET_PORT } from '@envy/core';
import React, { useEffect, useMemo, useState } from 'react';

import { ApplicationContext, ApplicationContextData } from '@/hooks/useApplication';
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';
import WebSocketClient from '@/model/WebSocketClient';
import { systems } from '@/systems';
import { Trace } from '@/types';

type TraceFilter = {
  systems: string[];
  value: string;
};

// TODO: allow configuration
const port = DEFAULT_WEB_SOCKET_PORT;

export default function ApplicationContextProvider({ children }: React.HTMLAttributes<HTMLElement>) {
  // TODO: find a better way to force a redraw
  const [, forceUpdate] = useState<boolean>(false);
  const [selectedTraceId, setSelectedTraceId] = useState<string | undefined>();
  const [filter, setFilter] = useState<TraceFilter | undefined>();

  const changeHandler = () => {
    forceUpdate(curr => !curr);
  };

  const manager = useMemo(() => new WebSocketClient({ port, changeHandler }), []);

  useKeyboardShortcut([
    {
      predicate: e => e.key === 'Escape',
      callback: () => setSelectedTraceId(undefined),
    },
    {
      predicate: e => e.key === 'ArrowUp',
      callback: () => {
        setSelectedTraceId(curr => {
          const traceIds = Object.keys(manager.traces);
          if (!curr) return traceIds?.[traceIds.length - 1] ?? undefined;
          const idx = traceIds.findIndex(x => x === curr);
          if (idx !== -1 && idx > 0) return traceIds[idx - 1];
          else return curr;
        });
      },
    },
    {
      predicate: e => e.key === 'ArrowDown',
      callback: () => {
        setSelectedTraceId(curr => {
          const traceIds = Object.keys(manager.traces);
          if (!curr) return traceIds?.[0] ?? undefined;
          const idx = traceIds.findIndex(x => x === curr);
          if (idx !== -1 && idx < traceIds.length - 1) return traceIds[idx + 1];
          else return curr;
        });
      },
    },
  ]);

  useEffect(() => {
    manager.start();
  }, [manager]);

  const hasFilters = () => {
    if (!filter) return false;
    if (filter.systems.length > 0) return true;
    if (filter.value) return true;
    return false;
  };

  const value: ApplicationContextData = {
    port: manager.port,
    connecting: manager.connecting,
    connected: manager.connected,
    get traces() {
      if (!filter || !hasFilters()) return manager.traces;
      else {
        const filteredTraces: Record<string, Trace> = {};
        for (const traceId in manager.traces) {
          const conn = manager.traces[traceId];
          const url = `${conn?.req?.host || ''}${conn?.req?.path || ''}`;
          let includeInTraces = true;

          if (!!filter.value && !url.includes(filter.value)) includeInTraces = false;

          if (includeInTraces && filter.systems.length > 0) {
            const validSystems = systems.filter(x => filter.systems.includes(x.name));
            includeInTraces = validSystems.some(x => x.isMatch(conn));
          }

          if (includeInTraces) filteredTraces[traceId] = conn;
        }
        return filteredTraces;
      }
    },
    traceId: selectedTraceId,
    setSelectedTrace(id: string) {
      setSelectedTraceId(() => id);
    },
    getSelectedTrace() {
      return (selectedTraceId && manager.traces[selectedTraceId]) || undefined;
    },
    clearSelectedTrace() {
      setSelectedTraceId(undefined);
    },
    filterTraces(systems, value) {
      setFilter({ systems, value });
    },
    clearTraces() {
      setSelectedTraceId(undefined);
      manager.clearTraces();
    },
  };

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}
