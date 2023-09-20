import { act, cleanup, render } from '@testing-library/react';

import Section from './Section';
import userEvent from '@testing-library/user-event';

describe('Section', () => {
  function Icon() {
    return <div data-test-id="mock-icon">Mock Icon component</div>;
  }

  afterEach(() => {
    cleanup();
  });

  it('should render without error', () => {
    render(<Section />);
  });

  it('should render content', () => {
    const { getByTestId } = render(<Section>Section content</Section>);

    const content = getByTestId('section-content');

    expect(content).toBeVisible();
    expect(content).toHaveTextContent('Section content');
  });

  it('should render title before content if supplied', () => {
    const { getByTestId } = render(<Section title="Section title">Section content</Section>);

    const title = getByTestId('section-title');
    const content = getByTestId('section-content');

    expect(title).toBeVisible();
    expect(title).toHaveTextContent('Section title');
    expect(title.nextSibling).toBe(content);
  });

  it('should hide content if clicking on title', async () => {
    const { getByTestId, queryByTestId } = render(<Section title="Section title">Section content</Section>);

    await act(async () => {
      const title = getByTestId('section-title');
      await userEvent.click(title);
    });

    const content = queryByTestId('section-content');
    expect(content).not.toBeInTheDocument();
  });

  it('should show content if clicking on title when hidden', async () => {
    const { getByTestId, queryByTestId } = render(<Section title="Section title">Section content</Section>);

    await act(async () => {
      const title = getByTestId('section-title');
      await userEvent.click(title);
    });

    const contentBefore = queryByTestId('section-content');
    expect(contentBefore).not.toBeInTheDocument();

    await act(async () => {
      const title = getByTestId('section-title');
      await userEvent.click(title);
    });

    const contentAfter = queryByTestId('section-content');
    expect(contentAfter).toBeVisible();
  });

  it('should not hide content if clicking on title when `collapsible` is `false`', async () => {
    const { getByTestId, queryByTestId } = render(
      <Section title="Section title" collapsible={false}>
        Section content
      </Section>
    );

    await act(async () => {
      const title = getByTestId('section-title');
      await userEvent.click(title);
    });

    const content = queryByTestId('section-content');
    expect(content).toBeVisible();
  });
});
