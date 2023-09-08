import { createContext, useContext } from 'react';

import { ConnectionData, Traces } from '@/types';

export type ApplicationContextData = {
  port: number;
  connecting: boolean;
  connected: boolean;
  connectionId?: string;
  connections: Traces;
  getSelectedConnection: () => ConnectionData | undefined;
  setSelectedConnection: (id: string) => void;
  clearSelectedConnection: () => void;
  filterConnections: (systems: string[], value: string) => void;
  clearConnections: () => void;
};

export const ApplicationContext = createContext<ApplicationContextData>(
  {} as ApplicationContextData,
);

export default function useApplication() {
  return useContext(ApplicationContext);
}
