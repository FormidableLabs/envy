import { DEFAULT_WEB_SOCKET_PORT } from '@envyjs/core';
import React, { useEffect, useRef, useState } from 'react';

import { ApplicationContext, ApplicationContextData } from '@/hooks/useApplication';
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';
import CollectorClient from '@/model/CollectorClient';
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

  const collectorRef = useRef<CollectorClient>();

  useKeyboardShortcut([
    {
      predicate: e => e.key === 'Escape',
      callback: () => setSelectedTraceId(undefined),
    },
    {
      predicate: e => e.key === 'ArrowUp',
      callback: () => {
        setSelectedTraceId(curr => {
          if (!collectorRef.current) return;
          const traceIds = Object.keys(collectorRef.current.traces);
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
          if (!collectorRef.current) return;
          const traceIds = Object.keys(collectorRef.current.traces);
          if (!curr) return traceIds?.[0] ?? undefined;
          const idx = traceIds.findIndex(x => x === curr);
          if (idx !== -1 && idx < traceIds.length - 1) return traceIds[idx + 1];
          else return curr;
        });
      },
    },
  ]);

  useEffect(() => {
    if (!collectorRef.current) {
      collectorRef.current = new CollectorClient({ port, changeHandler });
      collectorRef.current.start();
    }
  }, []);

  const hasFilters = () => {
    if (!filter) return false;
    if (filter.systems.length > 0) return true;
    if (filter.value) return true;
    return false;
  };

  const value: ApplicationContextData = {
    collector: collectorRef.current,
    port: collectorRef.current?.port ?? 0,
    connecting: collectorRef.current?.connecting ?? true,
    connected: collectorRef.current?.connected ?? false,
    get traces() {
      if (!collectorRef.current) return new Map();
      if (!filter || !hasFilters()) return collectorRef.current?.traces;
      else {
        const filteredTraces = new Map<string, Trace>();
        for (const [traceId, trace] of collectorRef.current.traces.entries()) {
          let includeInTraces = true;

          if (!!filter.value && !trace?.http?.url.includes(filter.value)) includeInTraces = false;

          if (includeInTraces && filter.systems.length > 0) {
            const validSystems = systems.filter(x => filter.systems.includes(x.name));
            includeInTraces = validSystems.some(x => x.isMatch(trace));
          }

          if (includeInTraces) filteredTraces.set(traceId, trace);
        }
        return filteredTraces;
      }
    },
    selectedTraceId: selectedTraceId,
    setSelectedTrace(id: string) {
      setSelectedTraceId(() => id);
    },
    getSelectedTrace() {
      return (selectedTraceId && collectorRef.current?.traces.get(selectedTraceId)) || undefined;
    },
    clearSelectedTrace() {
      setSelectedTraceId(undefined);
    },
    filterTraces(systems, value) {
      setFilter({ systems, value });
    },
    clearTraces() {
      setSelectedTraceId(undefined);
      collectorRef.current?.clearTraces();
    },
  };

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}
