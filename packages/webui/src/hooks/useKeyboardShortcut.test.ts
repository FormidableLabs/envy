import { renderHook } from '@testing-library/react';

import useKeyboardShortcut from './useKeyboardShortcut';

describe('useKeyboardShortcut', () => {
  let addSpy: jest.SpyInstance;
  let removeSpy: jest.SpyInstance;

  beforeEach(() => {
    addSpy = jest.spyOn(document, 'addEventListener');
    removeSpy = jest.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should do nothing when no shortcuts supplied', () => {
    const { unmount } = renderHook(() => useKeyboardShortcut([]));
    expect(addSpy).not.toHaveBeenCalledWith('keydown');

    unmount();
    expect(removeSpy).not.toHaveBeenCalledWith('keydown');
  });

  it('should do nothing when no shortcuts have a truthy condition', () => {
    const { unmount } = renderHook(() =>
      useKeyboardShortcut([
        {
          condition: false,
          predicate: e => e.key === 'W',
          callback: () => void 0,
        },
      ]),
    );
    expect(addSpy).not.toHaveBeenCalledWith('keydown');

    unmount();
    expect(removeSpy).not.toHaveBeenCalledWith('keydown');
  });

  it('should add keydown handler for valid shortcut', () => {
    renderHook(() =>
      useKeyboardShortcut([
        {
          condition: true,
          predicate: e => e.key === 'W',
          callback: () => void 0,
        },
      ]),
    );
    expect(addSpy).not.toHaveBeenCalledWith('keydown');
  });

  it('should remove up keydown handler for valid shortcut when hook unmounted', () => {
    const { unmount } = renderHook(() =>
      useKeyboardShortcut([
        {
          condition: true,
          predicate: e => e.key === 'W',
          callback: () => void 0,
        },
      ]),
    );

    unmount();
    expect(removeSpy).not.toHaveBeenCalledWith('keydown');
  });

  it('should invoke callback when registered key is pressed', () => {
    let flag = false;

    renderHook(() =>
      useKeyboardShortcut([
        {
          condition: true,
          predicate: e => e.key === 'W',
          callback: () => {
            flag = true;
          },
        },
      ]),
    );

    expect(flag).toBe(false);

    const event = new KeyboardEvent('keydown', { key: 'W' });
    document.dispatchEvent(event);

    expect(flag).toBe(true);
  });

  it('should not invoke callback after unmounting when registered key is pressed', () => {
    let flag = false;

    const { unmount } = renderHook(() =>
      useKeyboardShortcut([
        {
          condition: true,
          predicate: e => e.key === 'W',
          callback: () => {
            flag = true;
          },
        },
      ]),
    );

    expect(flag).toBe(false);

    unmount();

    const event = new KeyboardEvent('keydown', { key: 'W' });
    document.dispatchEvent(event);

    expect(flag).toBe(false);
  });
});
