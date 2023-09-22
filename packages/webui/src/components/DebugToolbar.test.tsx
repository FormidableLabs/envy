import { act, cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import mockTraces from '@/testing/mockTraces';
import { setUseApplicationData } from '@/testing/mockUseApplication';

import DebugToolbar from './DebugToolbar';

describe('DebugToolbar', () => {
  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<DebugToolbar />);
  });

  it('should render a "Mock data" button `debugToolbar` as child', () => {
    const { getByRole } = render(<DebugToolbar />);

    const button = getByRole('button');
    expect(button).toHaveTextContent('Mock data');
  });

  it('should add all mock traces to the collecto when the "Mock data" button is clicked', async () => {
    const addEvent = jest.fn();

    setUseApplicationData({
      collector: {
        addEvent,
      } as any,
    });

    const { getByRole } = render(<DebugToolbar />);

    await act(async () => {
      const button = getByRole('button');
      await userEvent.click(button);
    });

    for (const trace of mockTraces) {
      expect(addEvent).toHaveBeenCalledWith(trace);
    }
  });
});
