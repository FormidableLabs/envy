import { ChangeEvent, Ref, RefObject, forwardRef, useEffect, useRef } from 'react';
import { IconType } from 'react-icons';
import { HiX } from 'react-icons/hi';

import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';
import usePlatform from '@/hooks/usePlatform';
import { tw } from '@/utils';

const DEBOUNCE_TIMEOUT = 300;

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  Icon?: IconType;
  focusKey?: string;
  onChange?: (value: string) => void;
};

function Input({ className, onChange, Icon, focusKey, ...props }: InputProps, ref: Ref<HTMLInputElement>) {
  const { isMac, specialKey } = usePlatform();
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, []);

  const filterFieldRef = useRef<HTMLInputElement>(null);
  const finalRef = (ref || filterFieldRef) as RefObject<HTMLInputElement>;

  useKeyboardShortcut([
    {
      condition: !!focusKey,
      predicate: e => (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === focusKey?.toLowerCase(),
      callback: () => {
        if (finalRef.current) finalRef.current.focus();
      },
    },
    {
      condition: !!focusKey,
      predicate: e => e.key.toLowerCase() === 'escape',
      callback: () => {
        if (finalRef.current) finalRef.current.blur();
      },
    },
  ]);

  function debouncedHandleChange(e: ChangeEvent<HTMLInputElement>) {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      onChange?.(e.target.value);
    }, DEBOUNCE_TIMEOUT);
  }

  function clearValue() {
    if (finalRef.current) finalRef.current.value = '';
    onChange?.('');
  }

  const fullProps = typeof onChange === 'function' ? { ...props, onChange: debouncedHandleChange } : props;

  return (
    <span className="group input-container">
      <input ref={finalRef} type="text" className={tw('input w-full', Icon && 'pl-9', className)} {...fullProps} />
      {Icon && <Icon />}
      {focusKey && specialKey && (
        <span className="focus-key">
          {specialKey}
          {focusKey}
        </span>
      )}
      {!!finalRef?.current?.value && (
        <span className="input-clear" onClick={() => clearValue()}>
          <HiX />
        </span>
      )}
    </span>
  );
}

export default forwardRef(Input);
