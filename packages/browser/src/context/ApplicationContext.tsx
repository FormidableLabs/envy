import { DEFAULT_WEB_SOCKET_PORT } from '@envy/core';
import React, { useEffect, useMemo, useState } from 'react';

import { ApplicationContext, ApplicationContextData } from '@/hooks/useApplication';
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';
import ConnectionManager from '@/model/ConnectionManager';
import { systems } from '@/systems';
import { ConnectionData } from '@/types';

type ConnectionFilter = {
  systems: string[];
  value: string;
};

// TODO: allow configuration
const port = DEFAULT_WEB_SOCKET_PORT;

export default function ApplicationContextProvider({ children }: React.HTMLAttributes<HTMLElement>) {
  // TODO: find a better way to force a redraw
  const [, forceUpdate] = useState<boolean>(false);
  const [connectionId, setConnectionId] = useState<string | undefined>();
  const [filter, setFilter] = useState<ConnectionFilter | undefined>();

  const changeHandler = () => {
    forceUpdate(curr => !curr);
  };

  const manager = useMemo(() => new ConnectionManager({ port, changeHandler }), []);

  useKeyboardShortcut([
    {
      predicate: e => e.key === 'Escape',
      callback: () => setConnectionId(undefined),
    },
    {
      predicate: e => e.key === 'ArrowUp',
      callback: () => {
        setConnectionId(curr => {
          const connectionIds = Object.keys(manager.traces);
          if (!curr) return connectionIds?.[connectionIds.length - 1] ?? undefined;
          const idx = connectionIds.findIndex(x => x === curr);
          if (idx !== -1 && idx > 0) return connectionIds[idx - 1];
          else return curr;
        });
      },
    },
    {
      predicate: e => e.key === 'ArrowDown',
      callback: () => {
        setConnectionId(curr => {
          const connectionIds = Object.keys(manager.traces);
          if (!curr) return connectionIds?.[0] ?? undefined;
          const idx = connectionIds.findIndex(x => x === curr);
          if (idx !== -1 && idx < connectionIds.length - 1) return connectionIds[idx + 1];
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
    get connections() {
      if (!filter || !hasFilters()) return manager.traces;
      else {
        const filteredConnections: Record<string, ConnectionData> = {};
        for (const connectionId in manager.traces) {
          const conn = manager.traces[connectionId];
          const url = `${conn?.req?.host || ''}${conn?.req?.path || ''}`;
          let includeInConnections = true;

          if (!!filter.value && !url.includes(filter.value)) includeInConnections = false;

          if (includeInConnections && filter.systems.length > 0) {
            const validSystems = systems.filter(x => filter.systems.includes(x.name));
            includeInConnections = validSystems.some(x => x.isMatch(conn));
          }

          if (includeInConnections) filteredConnections[connectionId] = conn;
        }
        return filteredConnections;
      }
    },
    connectionId: connectionId,
    setSelectedConnection(id: string) {
      setConnectionId(() => id);
    },
    getSelectedConnection() {
      return (connectionId && manager.traces[connectionId]) || undefined;
    },
    clearSelectedConnection() {
      setConnectionId(undefined);
    },
    filterConnections(systems, value) {
      setFilter({ systems, value });
    },
    clearConnections() {
      setConnectionId(undefined);
      manager.clearTraces();
    },
  };

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
}
