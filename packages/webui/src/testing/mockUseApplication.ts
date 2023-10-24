import useApplication, { ApplicationContextData } from '@/hooks/useApplication';

jest.mock('@/hooks/useApplication');

const defaults: ApplicationContextData = {
  collector: undefined,
  port: 9999,
  connecting: true,
  connected: false,
  traces: new Map(),
  connections: [],
  getSelectedTrace: () => void 0,
  setSelectedTrace: () => void 0,
  clearSelectedTrace: () => void 0,
  filters: {
    sources: [],
    systems: [],
    searchTerm: '',
  },
  setFilters: () => void 0,
  clearTraces: () => void 0,
  selectedTab: 'default',
  setSelectedTab: () => void 0,
};

beforeEach(() => {
  jest.mocked(useApplication).mockReturnValue(defaults);
});

export function setUseApplicationData(data: Partial<ApplicationContextData>) {
  jest.mocked(useApplication).mockReturnValue({
    ...defaults,
    ...data,
  });
}
