import { createContext, useContext } from 'react';

import { Trace, Traces } from '@/types';

export type ApplicationContextData = {
  port: number;
  connecting: boolean;
  connected: boolean;
  traceId?: string;
  traces: Traces;
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
