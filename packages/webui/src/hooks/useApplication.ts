import { createContext, useContext } from 'react';

import CollectorClient from '@/collector/CollectorClient';
import { Trace, Traces } from '@/types';

export type ApplicationContextData = {
  collector: CollectorClient | undefined;
  port: number;
  connecting: boolean;
  connected: boolean;
  connections: string[];
  traces: Traces;
  selectedTraceId?: string;
  newestTraceId?: string;
  getSelectedTrace: () => Trace | undefined;
  setSelectedTrace: (id: string) => void;
  clearSelectedTrace: () => void;
  filterTraces: (systems: string[], value: string) => void;
  clearTraces: () => void;
};

export const ApplicationContext = createContext<ApplicationContextData>({} as ApplicationContextData);

export default function useApplication() {
  return useContext(ApplicationContext);
}
