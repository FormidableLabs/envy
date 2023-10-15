import { useEffect, useState } from 'react';
import { HiCheck } from 'react-icons/hi';

import { tw } from '@/utils';

type ToggleSwitchProps = Omit<React.HTMLAttributes<HTMLLabelElement>, 'onChange'> & {
  label?: string;
  labelPosition?: 'left' | 'right';
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  readOnly?: boolean;
  disabled?: boolean;
};

export default function ToggleSwitch({
  label,
  labelPosition,
  checked,
  onChange,
  readOnly,
  disabled,
  className,
  ...props
}: ToggleSwitchProps) {
  const [isChecked, setIsChecked] = useState(checked ?? false);

  useEffect(() => {
    setIsChecked(checked ?? false);
  }, [checked]);

  return (
    <label
      className={tw(
        'flex flex-row items-center py-1 px-2 rounded',
        !disabled && !readOnly && 'cursor-pointer hover:bg-white',
        className,
      )}
      {...props}
    >
      {label && labelPosition !== 'right' && (
        <span data-test-id="label" className="mr-2">
          {label}
        </span>
      )}
      <div
        data-test-id="checkbox"
        className={tw('w-6 h-6 rounded', isChecked ? 'bg-green-400' : 'border border-secondary')}
      >
        {isChecked && <HiCheck data-test-id="checkmark" className="w-full h-full text-white" />}
        <input
          type="checkbox"
          className="appearance-none"
          checked={isChecked}
          disabled={disabled ?? false}
          readOnly={readOnly ?? false}
          onChange={() => {
            setIsChecked(!isChecked);
            onChange?.(!isChecked);
          }}
        />
      </div>
      {label && labelPosition === 'right' && (
        <span data-test-id="label" className="ml-2">
          {label}
        </span>
      )}
    </label>
  );
}
