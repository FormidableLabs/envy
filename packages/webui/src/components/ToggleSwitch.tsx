import { useEffect, useState } from 'react';
import { HiCheck } from 'react-icons/hi';

import IconButton from './IconButton';

type ToggleSwitchProps = Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function ToggleSwitch({ label, checked, onChange, ...props }: ToggleSwitchProps) {
  const [isChecked, setIsChecked] = useState(checked ?? false);

  useEffect(() => {
    setIsChecked(checked ?? false);
  }, [checked]);

  const onToggleChanged = () => {
    setIsChecked(!isChecked);
    if (onChange) onChange(!isChecked);
  };

  const Icon = isChecked
    ? () => <HiCheck className="h-4 w-4 rounded-sm bg-green-500 text-white" data-test-id="checkmark" />
    : () => <div className="border border-primary h-4 w-4 rounded-sm" />;

  return (
    <>
      <IconButton Icon={Icon} onClick={onToggleChanged} {...props}>
        <span data-test-id="label" className="uppercase">
          {label}
        </span>
      </IconButton>
    </>
  );
}
