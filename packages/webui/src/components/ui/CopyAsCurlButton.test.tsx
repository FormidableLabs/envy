import { act, cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import toast from 'react-hot-toast';

import { Trace } from '@/types';

import CopyAsCurlButton from './CopyAsCurlButton';

jest.mock('react-hot-toast');

describe('CopyAsCurlButton', () => {
  const originalClipboard = { ...global.navigator.clipboard };

  let trace: Trace;
  let writeTextFn: jest.Mock;
  let toastFn: jest.Mock;

  beforeEach(() => {
    trace = {
      http: {
        method: 'POST',
        url: 'https://www.foo.com/bar/baz',
      },
    } as any;

    writeTextFn = jest.fn();
    Object.assign(window.navigator, {
      clipboard: { writeText: writeTextFn },
    });

    toastFn = jest.fn();
    jest.mocked(toast.success).mockImplementation(toastFn);
  });

  afterEach(() => {
    jest.resetAllMocks();

    Object.assign(window.navigator, {
      clipboard: originalClipboard,
    });

    cleanup();
  });

  it('should render without error', () => {
    render(<CopyAsCurlButton trace={trace} />);
  });

  it('should render a button with the expected label', () => {
    const { getByRole } = render(<CopyAsCurlButton trace={trace} />);

    const button = getByRole('button');
    expect(button).toHaveTextContent('Copy as cURL snippet');
  });

  describe('cURL snippet', () => {
    it('should copy cURL snippet to clipboard when clicked', async () => {
      const { getByRole } = render(<CopyAsCurlButton trace={trace} />);

      await act(async () => {
        const button = getByRole('button');
        expect(button).toHaveTextContent('Copy as cURL snippet');

        await userEvent.click(button);
      });

      const expectedCurl = `curl https://www.foo.com/bar/baz \\
 -X POST`;

      expect(writeTextFn).toHaveBeenCalledWith(expectedCurl);
    });

    it('should include headers in snippet if headers are present', async () => {
      const traceWithHeaders = {
        http: {
          ...trace.http,
          requestHeaders: {
            foo: 'bar',
            baz: 'qux',
          },
        },
      } as any;

      const { getByRole } = render(<CopyAsCurlButton trace={traceWithHeaders} />);

      await act(async () => {
        const button = getByRole('button');
        expect(button).toHaveTextContent('Copy as cURL snippet');

        await userEvent.click(button);
      });

      const expectedCurl = `curl https://www.foo.com/bar/baz \\
 -X POST \\
-H "foo: bar" \\
-H "baz: qux"`;

      expect(writeTextFn).toHaveBeenCalledWith(expectedCurl);
    });

    it('should include body in snippet if body is present', async () => {
      const traceWithHeaders = {
        http: {
          ...trace.http,
          requestBody: JSON.stringify({ foo: 'bar', baz: 'qux' }),
        },
      } as any;

      const { getByRole } = render(<CopyAsCurlButton trace={traceWithHeaders} />);

      await act(async () => {
        const button = getByRole('button');
        expect(button).toHaveTextContent('Copy as cURL snippet');

        await userEvent.click(button);
      });

      const expectedCurl = `curl https://www.foo.com/bar/baz \\
 -X POST \\
-d "{\\"foo\\":\\"bar\\",\\"baz\\":\\"qux\\"}"`;

      expect(writeTextFn).toHaveBeenCalledWith(expectedCurl);
    });
  });

  it('should display toast notification when copied', async () => {
    const { getByRole } = render(<CopyAsCurlButton trace={trace} />);

    await act(async () => {
      const button = getByRole('button');
      expect(button).toHaveTextContent('Copy as cURL snippet');

      await userEvent.click(button);
    });

    expect(toastFn).toHaveBeenCalledWith('cURL snippet written to clipboard', {
      position: 'top-right',
    });
  });
});
