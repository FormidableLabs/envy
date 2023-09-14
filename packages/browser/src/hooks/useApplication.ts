import { createContext, useContext } from 'react';

import Collector from '@/model/Collector';
import { Trace, Traces } from '@/types';

export type ApplicationContextData = {
  collector: Collector;
  port: number;
  connecting: boolean;
  connected: boolean;
  traces: Traces;
  selectedTraceId?: string;
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
