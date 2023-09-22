import { ChangeEvent, Ref, RefObject, forwardRef, useEffect, useRef, useState } from 'react';
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
  const [value, setValue] = useState('');

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

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);

    if (timeout.current) clearTimeout(timeout.current);
    if (typeof onChange === 'function') {
      timeout.current = setTimeout(() => {
        onChange(e.target.value);
      }, DEBOUNCE_TIMEOUT);
    }
  }

  function clearValue() {
    setValue('');
    onChange?.('');
  }

  return (
    <span className="group input-container">
      <input
        ref={finalRef}
        type="text"
        className={tw('input w-full', Icon && 'pl-9', className)}
        value={value}
        onChange={handleChange}
        {...props}
      />
      {Icon && <Icon />}
      {focusKey && specialKey && (
        <span data-test-id="focus-key" className="focus-key">
          {specialKey}
          {focusKey}
        </span>
      )}
      {!!value && (
        <span data-test-id="input-clear" className="input-clear" onClick={clearValue}>
          <HiX />
        </span>
      )}
    </span>
  );
}

export default forwardRef(Input);
