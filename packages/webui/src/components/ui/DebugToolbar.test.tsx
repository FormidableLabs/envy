import { act, cleanup, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import mockTraces from '@/testing/mockTraces';
import { setUseApplicationData } from '@/testing/mockUseApplication';

import DebugToolbar from './DebugToolbar';

jest.mock('@/components', () => ({
  Menu: function ({ label, items, Icon, ...props }: any) {
    return (
      <div {...props}>
        <div>{label}</div>
        {items.map((x: any, idx: number) => (
          <button key={idx} onClick={() => x.callback()}>
            {x.label}
          </button>
        ))}
      </div>
    );
  },
}));

describe('DebugToolbar', () => {
  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it('should render without error', () => {
    render(<DebugToolbar />);
  });

  it('should render a Menu component', () => {
    const { getByTestId } = render(<DebugToolbar />);

    const menu = getByTestId('debug-menu');
    expect(menu).toHaveTextContent('Debug menu');
  });

  it('should add all mock traces when the "Mock data" option is clicked', async () => {
    const addEvent = jest.fn();

    setUseApplicationData({
      collector: {
        addEvent,
      } as any,
    });

    const { getByTestId } = render(<DebugToolbar />);

    await act(async () => {
      const menu = getByTestId('debug-menu');
      const buttons = within(menu).getAllByRole('button');
      await userEvent.click(buttons.at(0)!);
    });

    for (const trace of mockTraces) {
      expect(addEvent).toHaveBeenCalledWith(trace);
    }
  });

  it('should log all traces to the console when the "Print traces" option is clicked', async () => {
    const spy = jest.spyOn(console, 'log');
    spy.mockImplementation(() => void 0);

    const mockTraces = ['mock_trace_1', 'mock_trace_2', 'mock_trace_3'];

    setUseApplicationData({
      traces: mockTraces as any,
    });

    const { getByTestId } = render(<DebugToolbar />);

    await act(async () => {
      const menu = getByTestId('debug-menu');
      const buttons = within(menu).getAllByRole('button');
      await userEvent.click(buttons.at(1)!);
    });

    expect(spy).toHaveBeenCalledWith('Traces:', mockTraces);
  });
});
