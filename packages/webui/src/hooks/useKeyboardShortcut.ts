import { useCallback, useEffect } from 'react';

export type Shortcut = {
  condition?: boolean;
  predicate: (e: KeyboardEvent) => boolean;
  callback: (e?: KeyboardEvent) => void;
};

export default function useKeyboardShortcut(shortcuts: Shortcut[]) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      shortcuts.forEach(x => {
        if (x.predicate(e)) {
          e.preventDefault();
          x.callback(e);
        }
      });
    },
    [shortcuts],
  );

  useEffect(() => {
    if (shortcuts.filter(x => x.condition !== false).length === 0) return;

    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [shortcuts, handler]);
}
