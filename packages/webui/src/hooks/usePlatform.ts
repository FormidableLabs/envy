import { useRef } from 'react';

export default function usePlatform() {
  const ua = navigator.userAgent;
  const isMac = useRef<boolean>(/Macintosh/i.test(ua));
  const isWindows = useRef<boolean>(/Windows/i.test(ua));

  const specialKey = useRef<string>(isMac.current === true ? '⌘' : 'CTRL+');

  return {
    isMac: isMac.current,
    isWindows: isWindows.current,
    specialKey: specialKey.current,
  };
}
