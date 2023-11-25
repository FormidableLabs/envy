import { DEFAULT_WEB_SOCKET_PORT } from '@envyjs/core';
import React, { useEffect, useRef, useState } from 'react';

import CollectorClient from '@/collector/CollectorClient';
import { ApplicationContext, ApplicationContextData, Filters } from '@/hooks/useApplication';
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';
import { getSearchKeywords } from '@/systems';
import { getRegisteredSystems } from '@/systems/registration';
import { Trace } from '@/types';

// TODO: allow configuration
const port = DEFAULT_WEB_SOCKET_PORT;

export default function ApplicationContextProvider({ children }: React.HTMLAttributes<HTMLElement>) {
  // TODO: find a better way to force a redraw
  const [, forceUpdate] = useState<boolean>(false);
  const [selectedTraceId, setSelectedTraceId] = useState<string | undefined>();
  const [newestTraceId, setNewestTraceId] = useState<string | undefined>();
  const [filters, setFilters] = useState<Filters>({
    sources: [],
    systems: [],
    searchTerm: '',
  });

  const initialTab = window.location.hash?.replace('#', '') || 'default';
  const [selectedTab, setSelectedTab] = useState(initialTab);

  const changeHandler = (newTraceId?: string) => {
    if (newTraceId) setNewestTraceId(newTraceId);
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
          const traceIds = [...collectorRef.current!.traces.keys()];
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
          const traceIds = [...collectorRef.current!.traces.keys()];
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
      changeHandler();
    }
  }, []);

  const hasFilters = () => {
    if (!!filters?.sources?.length) return true;
    if (!!filters?.systems?.length) return true;
    if (!!filters?.searchTerm) return true;
    return false;
  };

  const value: ApplicationContextData = {
    collector: collectorRef.current,
    port: collectorRef.current?.port ?? 0,
    connecting: collectorRef.current?.connecting ?? true,
    connected: collectorRef.current?.connected ?? false,
    connections: collectorRef.current?.connections ?? [],
    get traces() {
      if (!collectorRef.current) return new Map();
      if (!hasFilters()) return collectorRef.current?.traces;
      else {
        const filteredTraces = new Map<string, Trace>();
        const systems = getRegisteredSystems();
        const validSystems = systems.filter(x => filters.systems.includes(x.name));

        for (const [traceId, trace] of collectorRef.current.traces.entries()) {
          let includeInTraces = true;

          if (!!filters.searchTerm) {
            const searchTermInUrl = trace?.http?.url.includes(filters.searchTerm);
            const keywords = getSearchKeywords(trace);
            const searchTermInKeywords =
              keywords.length > 0
                ? keywords.some(x => x.toLowerCase().includes(filters.searchTerm.toLowerCase()))
                : false;
            if (!searchTermInUrl && !searchTermInKeywords) includeInTraces = false;
          }

          if (includeInTraces && filters.sources.length > 0) {
            includeInTraces = !!trace.serviceName && filters.sources.includes(trace.serviceName);
          }

          if (includeInTraces && filters.systems.length > 0) {
            includeInTraces = validSystems.some(x => x.isMatch(trace));
          }

          if (includeInTraces) filteredTraces.set(traceId, trace);
        }

        return filteredTraces;
      }
    },
    selectedTraceId,
    newestTraceId,
    setSelectedTrace(id: string) {
      setSelectedTraceId(() => id);
    },
    getSelectedTrace() {
      return (selectedTraceId && collectorRef.current?.traces.get(selectedTraceId)) || undefined;
    },
    clearSelectedTrace() {
      setSelectedTraceId(undefined);
    },
    filters,
    setFilters,
    clearTraces() {
      setSelectedTraceId(undefined);
      collectorRef.current?.clearTraces();
    },
    selectedTab,
    setSelectedTab,
  };

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}
