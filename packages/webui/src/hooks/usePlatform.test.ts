import { renderHook } from '@testing-library/react';

import usePlatform from './usePlatform';

describe('usePlatform', () => {
  const setUserAgent = (ua: string) => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: ua,
      writable: true,
    });
  };

  const originalUserAgent = window.navigator.userAgent;

  afterEach(() => {
    setUserAgent(originalUserAgent);
  });

  describe('when user agent contains Macintosh', () => {
    beforeEach(() => {
      setUserAgent('This is a Macintosh user agent');
    });

    it('should return expected object', () => {
      const { result } = renderHook(() => usePlatform());

      expect(result.current).toEqual({
        isMac: true,
        isWindows: false,
        specialKey: '⌘',
      });
    });
  });

  describe('when user agent contains Windows', () => {
    beforeEach(() => {
      setUserAgent('This is a Windows user agent');
    });

    it('should return expected object', () => {
      const { result } = renderHook(() => usePlatform());

      expect(result.current).toEqual({
        isMac: false,
        isWindows: true,
        specialKey: 'CTRL+',
      });
    });
  });
});
