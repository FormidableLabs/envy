import { act, cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactElement, useContext, useEffect } from 'react';

import CollectorClient from '@/collector/CollectorClient';
import { ApplicationContext } from '@/hooks/useApplication';
import { setupMockSystems } from '@/testing/mockSystems';
import mockTraces, { mockTraceCollection } from '@/testing/mockTraces';
import { Trace } from '@/types';

import ApplicationContextProvider from './ApplicationContext';

jest.mock('@/collector/CollectorClient');

type CollectorClientData = {
  port: number;
  traces: Map<string, Trace>;
  connected: boolean;
  connecting: boolean;
  startFn: () => void;
  clearTracesFn: () => void;
};

describe('ApplicationContext', () => {
  let mockCollector: jest.Mock<CollectorClient>;

  function setupMockCollector(overrides?: Partial<CollectorClientData>) {
    mockCollector.mockImplementation(() => {
      const defaults: CollectorClientData = {
        port: 1234,
        traces: mockTraceCollection(),
        connected: true,
        connecting: false,
        startFn: jest.fn(),
        clearTracesFn: jest.fn(),
      };

      const data = {
        ...defaults,
        ...overrides,
      };

      return {
        get port() {
          return data.port;
        },
        get traces() {
          return data.traces;
        },
        get connected() {
          return data.connected;
        },
        get connecting() {
          return data.connecting;
        },

        start: data.startFn,
        clearTraces: data.clearTracesFn,
      } as unknown as CollectorClient;
    });
  }

  function renderComponentInProvider(component: ReactElement) {
    return render(component, { wrapper: ApplicationContextProvider });
  }

  function traceString(trace: Trace): string {
    return `${trace.id} ${trace.timestamp} ${trace.http?.url}`;
  }

  beforeEach(() => {
    mockCollector = jest.mocked(CollectorClient) as jest.Mock<CollectorClient>;

    setupMockSystems();
    setupMockCollector();
  });

  afterEach(() => {
    cleanup();
  });

  describe('properties', () => {
    it('should expose port from collector client', async () => {
      setupMockCollector({ port: 1234 });

      function TestComponent() {
        const { port } = useContext(ApplicationContext);
        return <div data-test-id="value">{port}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);
      const value = getByTestId('value');

      expect(value).toHaveTextContent('1234');
    });

    it('should expose connected status from collector client', async () => {
      setupMockCollector({ connected: true });

      function TestComponent() {
        const { connected } = useContext(ApplicationContext);
        return <div data-test-id="value">{connected.toString()}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);
      const value = getByTestId('value');

      expect(value).toHaveTextContent('true');
    });

    it('should expose connecting status from collector client', async () => {
      setupMockCollector({ connecting: true });

      function TestComponent() {
        const { connecting } = useContext(ApplicationContext);
        return <div data-test-id="value">{connecting.toString()}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);
      const value = getByTestId('value');

      expect(value).toHaveTextContent('true');
    });

    it('should expose traces from collector client', async () => {
      setupMockCollector({ traces: mockTraceCollection() });

      function TestComponent() {
        const { traces } = useContext(ApplicationContext);
        return (
          <ul>
            {[...traces.entries()].map(([id, trace]) => (
              <li data-test-id="trace" key={id}>
                {traceString(trace)}
              </li>
            ))}
          </ul>
        );
      }

      const { getAllByTestId } = renderComponentInProvider(<TestComponent />);
      const traces = getAllByTestId('trace');

      expect(traces).toHaveLength(mockTraces.length);
      mockTraces.forEach((trace, idx) => {
        expect(traces.at(idx)).toHaveTextContent(traceString(trace));
      });
    });

    it('should expose selectedTraceId as undefined initially', async () => {
      function TestComponent() {
        const { selectedTraceId } = useContext(ApplicationContext);
        return <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);
      const value = getByTestId('value');

      expect(value).toHaveTextContent('undefined');
    });

    it('should expose newestTraceId as undefined initially', async () => {
      function TestComponent() {
        const { newestTraceId } = useContext(ApplicationContext);
        return <div data-test-id="value">{newestTraceId ?? 'undefined'}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);
      const value = getByTestId('value');

      expect(value).toHaveTextContent('undefined');
    });
  });

  describe('functions', () => {
    describe('setSelectedTrace', () => {
      it('should update `selectedTraceId`', async () => {
        const traceIdToSelect = '2';

        function TestComponent() {
          const { selectedTraceId, setSelectedTrace } = useContext(ApplicationContext);
          return (
            <>
              <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>
              <button data-test-id="button" onClick={() => setSelectedTrace(traceIdToSelect)}>
                Button
              </button>
            </>
          );
        }

        const { getByTestId } = renderComponentInProvider(<TestComponent />);

        const valueBefore = getByTestId('value');
        expect(valueBefore).toHaveTextContent('undefined');

        await act(async () => {
          const button = getByTestId('button');
          await userEvent.click(button);
        });

        const valueAfter = getByTestId('value');
        expect(valueAfter).toHaveTextContent('2');
      });
    });

    describe('getSelectedTrace', () => {
      it('should return undefined if `selectedTraceId` is `undefined`', async () => {
        function TestComponent() {
          const { getSelectedTrace } = useContext(ApplicationContext);

          const trace = getSelectedTrace();
          return <div data-test-id="value">{trace ? traceString(trace) : 'undefined'}</div>;
        }

        const { getByTestId } = renderComponentInProvider(<TestComponent />);

        const value = getByTestId('value');
        expect(value).toHaveTextContent('undefined');
      });

      it('should return traces if `selectedTraceId` is found in `traces`', async () => {
        const traceIdToSelect = '3';

        function TestComponent() {
          const { setSelectedTrace, getSelectedTrace } = useContext(ApplicationContext);

          const trace = getSelectedTrace();

          return (
            <>
              <div data-test-id="value">{trace ? traceString(trace) : 'undefined'}</div>
              <button data-test-id="button" onClick={() => setSelectedTrace(traceIdToSelect)}>
                Button
              </button>
            </>
          );
        }

        const { getByTestId } = renderComponentInProvider(<TestComponent />);

        await act(async () => {
          const button = getByTestId('button');
          await userEvent.click(button);
        });

        const expectedTrace = mockTraces.find(x => x.id === traceIdToSelect);

        const value = getByTestId('value');
        expect(value).toHaveTextContent(traceString(expectedTrace!));
      });

      it('should return undefined if `selectedTraceId` is not found in `traces`', async () => {
        const traceIdToSelect = 'foo';

        function TestComponent() {
          const { setSelectedTrace, getSelectedTrace } = useContext(ApplicationContext);

          const trace = getSelectedTrace();

          return (
            <>
              <div data-test-id="value">{trace ? traceString(trace) : 'undefined'}</div>
              <button data-test-id="button" onClick={() => setSelectedTrace(traceIdToSelect)}>
                Button
              </button>
            </>
          );
        }

        const { getByTestId } = renderComponentInProvider(<TestComponent />);

        await act(async () => {
          const button = getByTestId('button');
          await userEvent.click(button);
        });

        const value = getByTestId('value');
        expect(value).toHaveTextContent('undefined');
      });
    });

    describe('clearSelectedTrace', () => {
      it('should set `selectedTraceId` to undefined', async () => {
        const traceIdToSelect = '2';

        function TestComponent() {
          const { selectedTraceId, setSelectedTrace, clearSelectedTrace } = useContext(ApplicationContext);
          return (
            <>
              <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>
              <button data-test-id="button-set" onClick={() => setSelectedTrace(traceIdToSelect)}>
                Button
              </button>
              <button data-test-id="button-clear" onClick={() => clearSelectedTrace()}>
                Button
              </button>
            </>
          );
        }

        const { getByTestId } = renderComponentInProvider(<TestComponent />);

        await act(async () => {
          const button = getByTestId('button-set');
          await userEvent.click(button);
        });

        const valueAfterSet = getByTestId('value');
        expect(valueAfterSet).toHaveTextContent('2');

        await act(async () => {
          const button = getByTestId('button-clear');
          await userEvent.click(button);
        });

        const valueAfterClear = getByTestId('value');
        expect(valueAfterClear).toHaveTextContent('undefined');
      });
    });

    describe('filterTraces', () => {
      it('should filter traces by system', async () => {
        const systems = ['OddNumbers'];
        const value = '';

        function TestComponent() {
          const { traces, filterTraces } = useContext(ApplicationContext);

          return (
            <>
              <ul>
                {[...traces.entries()].map(([id, trace]) => (
                  <li data-test-id="trace" key={id}>
                    {traceString(trace)}
                  </li>
                ))}
              </ul>
              <button data-test-id="button" onClick={() => filterTraces(systems, value)}>
                Button
              </button>
            </>
          );
        }

        const { getByTestId, getAllByTestId } = renderComponentInProvider(<TestComponent />);

        await act(async () => {
          const button = getByTestId('button');
          await userEvent.click(button);
        });

        const traces = getAllByTestId('trace');

        const expectedTraces = mockTraces.filter(x => parseInt(x.id) % 2 === 1);

        expect(traces).toHaveLength(expectedTraces.length);
        expectedTraces.forEach((trace, idx) => {
          expect(traces.at(idx)).toHaveTextContent(traceString(trace));
        });
      });

      it('should filter traces by value', async () => {
        const systems: string[] = [];
        const value = 'data.restserver';

        function TestComponent() {
          const { traces, filterTraces } = useContext(ApplicationContext);

          return (
            <>
              <ul>
                {[...traces.entries()].map(([id, trace]) => (
                  <li data-test-id="trace" key={id}>
                    {traceString(trace)}
                  </li>
                ))}
              </ul>
              <button data-test-id="button" onClick={() => filterTraces(systems, value)}>
                Button
              </button>
            </>
          );
        }

        const { getByTestId, getAllByTestId } = renderComponentInProvider(<TestComponent />);

        await act(async () => {
          const button = getByTestId('button');
          await userEvent.click(button);
        });

        const traces = getAllByTestId('trace');

        const expectedTraces = mockTraces.filter(x => x.http?.host.includes(value));

        expect(traces).toHaveLength(expectedTraces.length);
        expectedTraces.forEach((trace, idx) => {
          expect(traces.at(idx)).toHaveTextContent(traceString(trace));
        });
      });

      it('should show all traces if no systems or value have been set', async () => {
        const systems: string[] = [];
        const value = '';

        function TestComponent() {
          const { traces, filterTraces } = useContext(ApplicationContext);

          return (
            <>
              <ul>
                {[...traces.entries()].map(([id, trace]) => (
                  <li data-test-id="trace" key={id}>
                    {traceString(trace)}
                  </li>
                ))}
              </ul>
              <button data-test-id="button" onClick={() => filterTraces(systems, value)}>
                Button
              </button>
            </>
          );
        }

        const { getByTestId, getAllByTestId } = renderComponentInProvider(<TestComponent />);

        await act(async () => {
          const button = getByTestId('button');
          await userEvent.click(button);
        });

        const traces = getAllByTestId('trace');
        expect(traces).toHaveLength(mockTraces.length);
        mockTraces.forEach((trace, idx) => {
          expect(traces.at(idx)).toHaveTextContent(traceString(trace));
        });
      });
    });

    describe('clearTraces', () => {
      it('should set `selectedTraceId` to undefined', async () => {
        const traceIdToSelect = '2';

        function TestComponent() {
          const { selectedTraceId, setSelectedTrace, clearTraces } = useContext(ApplicationContext);
          return (
            <>
              <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>
              <button data-test-id="button-set" onClick={() => setSelectedTrace(traceIdToSelect)}>
                Button
              </button>
              <button data-test-id="button-clear" onClick={() => clearTraces()}>
                Button
              </button>
            </>
          );
        }

        const { getByTestId } = renderComponentInProvider(<TestComponent />);

        await act(async () => {
          const button = getByTestId('button-set');
          await userEvent.click(button);
        });

        const valueAfterSet = getByTestId('value');
        expect(valueAfterSet).toHaveTextContent('2');

        await act(async () => {
          const button = getByTestId('button-clear');
          await userEvent.click(button);
        });

        const valueAfterClear = getByTestId('value');
        expect(valueAfterClear).toHaveTextContent('undefined');
      });

      it('should call `clearTraces()` on collector', async () => {
        const clearTracesFn = jest.fn();
        setupMockCollector({ clearTracesFn });

        function TestComponent() {
          const { selectedTraceId, clearTraces } = useContext(ApplicationContext);
          return (
            <>
              <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>
              <button data-test-id="button" onClick={() => clearTraces()}>
                Button
              </button>
            </>
          );
        }

        const { getByTestId } = renderComponentInProvider(<TestComponent />);

        expect(clearTracesFn).not.toHaveBeenCalled();

        await act(async () => {
          const button = getByTestId('button');
          await userEvent.click(button);
        });

        expect(clearTracesFn).toHaveBeenCalled();
      });
    });
  });

  describe('keyboard navigation', () => {
    it('should update `selectedTraceId` to the previous one when pressing the up arrow', () => {
      function TestComponent() {
        const { selectedTraceId, setSelectedTrace } = useContext(ApplicationContext);

        useEffect(() => {
          setSelectedTrace('2');
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);

      const valueBefore = getByTestId('value');
      expect(valueBefore).toHaveTextContent('2');

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        document.dispatchEvent(event);
      });

      const valueAfter = getByTestId('value');
      expect(valueAfter).toHaveTextContent('1');
    });

    it('should keep current `selectedTraceId` when pressing the up arrow if it is the first one', () => {
      const firstTraceId = mockTraces[0].id;

      function TestComponent() {
        const { selectedTraceId, setSelectedTrace } = useContext(ApplicationContext);

        useEffect(() => {
          setSelectedTrace(firstTraceId);
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        document.dispatchEvent(event);
      });

      const valueAfter = getByTestId('value');
      expect(valueAfter).toHaveTextContent(firstTraceId);
    });

    it('should set `selectedTraceId` to last trace when pressing the up arrow if no trace is selected', () => {
      const lastTraceId = mockTraces[mockTraces.length - 1].id;

      function TestComponent() {
        const { selectedTraceId } = useContext(ApplicationContext);

        return <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        document.dispatchEvent(event);
      });

      const valueAfter = getByTestId('value');
      expect(valueAfter).toHaveTextContent(lastTraceId);
    });

    it('should set `selectedTraceId` to undefined when pressing the up arrow and there are no traces', () => {
      setupMockCollector({ traces: new Map() });

      function TestComponent() {
        const { selectedTraceId } = useContext(ApplicationContext);

        return <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
        document.dispatchEvent(event);
      });

      const valueAfter = getByTestId('value');
      expect(valueAfter).toHaveTextContent('undefined');
    });

    it('should update `selectedTraceId` to the next one when pressing the down arrow', () => {
      function TestComponent() {
        const { selectedTraceId, setSelectedTrace } = useContext(ApplicationContext);

        useEffect(() => {
          setSelectedTrace('2');
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);

      const valueBefore = getByTestId('value');
      expect(valueBefore).toHaveTextContent('2');

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        document.dispatchEvent(event);
      });

      const valueAfter = getByTestId('value');
      expect(valueAfter).toHaveTextContent('3');
    });

    it('should keep current `selectedTraceId` when pressing the down arrow if it is the last one', () => {
      const lastTraceId = mockTraces[mockTraces.length - 1].id;

      function TestComponent() {
        const { selectedTraceId, setSelectedTrace } = useContext(ApplicationContext);

        useEffect(() => {
          setSelectedTrace(lastTraceId);
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        document.dispatchEvent(event);
      });

      const valueAfter = getByTestId('value');
      expect(valueAfter).toHaveTextContent(lastTraceId);
    });

    it('should set `selectedTraceId` to first trace when pressing the down arrow if no trace is selected', () => {
      const firstTraceId = mockTraces[0].id;

      function TestComponent() {
        const { selectedTraceId } = useContext(ApplicationContext);

        return <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        document.dispatchEvent(event);
      });

      const valueAfter = getByTestId('value');
      expect(valueAfter).toHaveTextContent(firstTraceId);
    });

    it('should set `selectedTraceId` to undefined when pressing the down arrow and there are no traces', () => {
      setupMockCollector({ traces: new Map() });

      function TestComponent() {
        const { selectedTraceId } = useContext(ApplicationContext);

        return <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        document.dispatchEvent(event);
      });

      const valueAfter = getByTestId('value');
      expect(valueAfter).toHaveTextContent('undefined');
    });

    it('should set `selectedTraceId` to undefined when pressing the escape key', () => {
      function TestComponent() {
        const { selectedTraceId, setSelectedTrace } = useContext(ApplicationContext);

        useEffect(() => {
          setSelectedTrace('2');
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return <div data-test-id="value">{selectedTraceId ?? 'undefined'}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);

      const valueBefore = getByTestId('value');
      expect(valueBefore).toHaveTextContent('2');

      act(() => {
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        document.dispatchEvent(event);
      });

      const valueAfter = getByTestId('value');
      expect(valueAfter).toHaveTextContent('undefined');
    });
  });

  describe('broadcasting updates', () => {
    it('should update `newestTraceId` when the client collector triggers its change handler with a `newTraceId`', () => {
      mockCollector.mockImplementation(({ changeHandler }) => {
        return {
          start() {
            changeHandler('1');
          },
        } as unknown as CollectorClient;
      });

      function TestComponent() {
        const { newestTraceId } = useContext(ApplicationContext);
        return <div data-test-id="value">{newestTraceId ?? 'undefined'}</div>;
      }

      const { getByTestId } = renderComponentInProvider(<TestComponent />);
      const value = getByTestId('value');

      expect(value).toHaveTextContent('1');
    });
  });
});
