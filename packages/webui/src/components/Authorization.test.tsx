import { act, cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Authorization from './Authorization';

jest.mock('@/components', () => ({
  Code: function ({ children, ...props }: any) {
    return <div {...props}>{children}</div>;
  },
  Button: function ({ short, Icon, ...safeProps }: any) {
    return <button {...safeProps} />;
  },
  CodeDisplay: function ({ data, contentType, ...props }: any) {
    return <div {...props}>{data}</div>;
  },
}));

describe('Authorization', () => {
  const exampleJwtToken =
    'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.vqb33-7FqzFWPNlr0ElW1v2RjJRZBel3CdDHBWD7y_o';
  const exampleBearerToken = 'Bearer some_auth_data';
  const exampleBasicToken = 'Basic Zm9vOmJhcg==';

  afterEach(() => {
    cleanup();
  });

  const scenarios = [
    {
      name: 'JWT tokens',
      token: exampleJwtToken,
      decodedToken: JSON.stringify({ sub: '1234567890', name: 'John Doe', iat: 1516239022 }),
    },
    {
      name: 'non-JWT Bearer tokens',
      token: exampleBearerToken,
      decodedToken: null,
    },
    {
      name: 'Basic tokens',
      token: exampleBasicToken,
      decodedToken: JSON.stringify({ username: 'foo', password: 'bar' }),
    },
  ];

  describe.each(scenarios)('$name', ({ token, decodedToken }) => {
    it('should not render if no value is supplied', () => {
      const { container } = render(<Authorization value={null} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('should initially display token in minimal form only', () => {
      const { getByTestId, queryByTestId } = render(<Authorization value={token} />);

      const minimal = getByTestId('token-minimal-view');
      const expanded = queryByTestId('token-expanded-view');
      const decoded = queryByTestId('token-decoded-view');

      expect(minimal).toBeVisible();
      expect(minimal).toHaveTextContent(token);

      expect(expanded).not.toBeInTheDocument();
      expect(decoded).not.toBeInTheDocument();
    });

    it('should display expanded when clicking the token', async () => {
      const { getByTestId, queryByTestId } = render(<Authorization value={token} />);

      const minimal = getByTestId('token-minimal-view');

      await act(async () => {
        await userEvent.click(minimal);
      });

      const expanded = getByTestId('token-expanded-view');
      const decoded = queryByTestId('token-decoded-view');

      expect(minimal).not.toBeInTheDocument();
      expect(decoded).not.toBeInTheDocument();

      expect(expanded).toBeVisible();
      expect(expanded).toHaveTextContent(token);
    });

    if (decodedToken) {
      it('should display decoded view when clicking the decoded button', async () => {
        const { getByTestId, queryByTestId } = render(<Authorization value={token} />);

        const minimal = getByTestId('token-minimal-view');

        await act(async () => {
          await userEvent.click(minimal);
        });

        await act(async () => {
          const decodedButton = getByTestId('token-decoded-button');
          await userEvent.click(decodedButton);
        });

        const expanded = queryByTestId('token-expanded-view');
        const decoded = getByTestId('token-decoded-view');

        expect(minimal).not.toBeInTheDocument();
        expect(expanded).not.toBeInTheDocument();

        expect(decoded).toBeVisible();
        expect(decoded).toHaveTextContent(decodedToken);
      });

      it('should display encoded view when clicking the expanded button', async () => {
        const { getByTestId, queryByTestId } = render(<Authorization value={token} />);

        const minimal = getByTestId('token-minimal-view');

        await act(async () => {
          await userEvent.click(minimal);
        });

        await act(async () => {
          const decodedButton = getByTestId('token-decoded-button');
          await userEvent.click(decodedButton);
        });

        await act(async () => {
          const expandedButton = getByTestId('token-expanded-button');
          await userEvent.click(expandedButton);
        });

        const expanded = getByTestId('token-expanded-view');
        const decoded = queryByTestId('token-decoded-view');

        expect(minimal).not.toBeInTheDocument();
        expect(decoded).not.toBeInTheDocument();

        expect(expanded).toBeVisible();
        expect(expanded).toHaveTextContent(token);
      });

      it('should display minimal view when clicking collapsing the expanded view', async () => {
        const { getByTestId, queryByTestId } = render(<Authorization value={token} />);

        await act(async () => {
          const minimal = getByTestId('token-minimal-view');
          await userEvent.click(minimal);
        });

        await act(async () => {
          const minimalButton = getByTestId('token-minimal-button');
          await userEvent.click(minimalButton);
        });

        const minimal = getByTestId('token-minimal-view');
        const expanded = queryByTestId('token-expanded-view');
        const decoded = queryByTestId('token-decoded-view');

        expect(expanded).not.toBeInTheDocument();
        expect(decoded).not.toBeInTheDocument();

        expect(minimal).toBeVisible();
        expect(minimal).toHaveTextContent(token);
      });
    } else {
      it('should not provide option to display decoded token', async () => {
        const { getByTestId, queryByTestId } = render(<Authorization value={token} />);

        const minimal = getByTestId('token-minimal-view');

        await act(async () => {
          await userEvent.click(minimal);
        });

        const decodedButton = queryByTestId('token-decoded-button');
        expect(decodedButton).not.toBeInTheDocument();
      });
    }
  });
});
