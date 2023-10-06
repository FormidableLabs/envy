import { ConnectionStatusData } from '@envyjs/core';
import { Dispatch, SetStateAction, createContext, useContext } from 'react';

import CollectorClient from '@/collector/CollectorClient';
import { Trace, Traces } from '@/types';

export type Filters = {
  sources: string[];
  systems: string[];
  searchTerm: string;
};

export type ApplicationContextData = {
  collector: CollectorClient | undefined;
  port: number;
  connecting: boolean;
  connected: boolean;
  connections: ConnectionStatusData;
  traces: Traces;
  selectedTraceId?: string;
  newestTraceId?: string;
  getSelectedTrace: () => Trace | undefined;
  setSelectedTrace: (id: string) => void;
  clearSelectedTrace: () => void;
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
  clearTraces: () => void;
};

export const ApplicationContext = createContext<ApplicationContextData>({} as ApplicationContextData);

export default function useApplication() {
  return useContext(ApplicationContext);
}
