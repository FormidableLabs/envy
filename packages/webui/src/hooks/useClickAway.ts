import { RefObject, useCallback, useEffect } from 'react';

export default function useClickAway(ref: RefObject<HTMLElement>, callback: () => void) {
  const handler = useCallback<any>(
    (e: React.MouseEvent<HTMLElement>) => {
      if (ref?.current && !ref?.current?.contains(e.target as Node)) {
        callback?.();
      }
    },
    [ref, callback],
  );

  useEffect(() => {
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, [handler]);
}
