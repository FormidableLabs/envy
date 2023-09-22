import { cleanup, fireEvent, render } from '@testing-library/react';
import { useRef } from 'react';

import useClickAway from './useClickAway';

describe('useClickAway', () => {
  function buildComponent() {
    return function Component({ callback }: { callback: () => void }) {
      const ref = useRef(null);
      useClickAway(ref, callback);

      return (
        <div data-test-id="parent">
          <div data-test-id="ref" ref={ref}>
            Ref node
            <div data-test-id="child">Child node</div>
          </div>
          <div data-test-id="sibling">Sibling node</div>
        </div>
      );
    };
  }

  afterEach(() => {
    cleanup();
  });

  it('should not trigger callback when clicking node itself', () => {
    const spy = jest.fn();

    const Component = buildComponent();
    const { getByTestId } = render(<Component callback={spy} />);

    fireEvent(
      getByTestId('ref'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(spy).not.toHaveBeenCalled();
  });

  it('should not trigger callback when clicking child of node', () => {
    const spy = jest.fn();

    const Component = buildComponent();
    const { getByTestId } = render(<Component callback={spy} />);

    fireEvent(
      getByTestId('child'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(spy).not.toHaveBeenCalled();
  });

  it('should trigger callback when clicking sibling of node', () => {
    const spy = jest.fn();

    const Component = buildComponent();
    const { getByTestId } = render(<Component callback={spy} />);

    fireEvent(
      getByTestId('sibling'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(spy).toHaveBeenCalled();
  });

  it('should trigger callback when clicking parent of node', () => {
    const spy = jest.fn();

    const Component = buildComponent();
    const { getByTestId } = render(<Component callback={spy} />);

    fireEvent(
      getByTestId('parent'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }),
    );

    expect(spy).toHaveBeenCalled();
  });
});
