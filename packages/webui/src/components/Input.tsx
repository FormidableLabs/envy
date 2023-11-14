import { X } from 'lucide-react';
import { ChangeEvent, Ref, RefObject, forwardRef, useEffect, useRef, useState } from 'react';

import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';
import usePlatform from '@/hooks/usePlatform';

const DEBOUNCE_TIMEOUT = 300;

export type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  Icon?: React.FC<any>;
  focusKey?: string;
  onChange?: (value: string) => void;
};

function Input({ className, onChange, Icon, focusKey, type, ...props }: InputProps, ref: Ref<HTMLInputElement>) {
  const { isMac, specialKey } = usePlatform();
  const timeout = useRef<NodeJS.Timeout>();
  const [value, setValue] = useState('');
  const inputType = type || 'text';

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
    <div className="relative">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center ml-2">
          <Icon size={24} className="text-manatee-600" aria-hidden="true" />
        </div>
      )}
      <input
        className="flex w-full pl-10 pr-3 py-2 rounded-md border-0 bg-white text-manatee-600 ring-1 ring-inset ring-manatee-600 placeholder:text-manatee-600 focus:ring-manatee-700 focus:text-manatee-700 focus:ring-inset"
        ref={finalRef}
        type={inputType}
        onChange={handleChange}
        value={value}
        {...props}
      />
      {!value && focusKey && specialKey && (
        <span data-test-id="focus-key" className="absolute flex items-center inset-y-0 right-0 pr-3 text-neutral">
          {specialKey}
          {focusKey}
        </span>
      )}
      {!!value && (
        <span
          data-test-id="input-clear"
          className="absolute flex items-center inset-y-0 right-0 pr-3 text-neutral cursor-pointer"
          onClick={clearValue}
        >
          <X />
        </span>
      )}
    </div>
  );
}

export default forwardRef(Input);
