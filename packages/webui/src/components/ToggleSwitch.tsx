import { CheckSquare, Square } from 'lucide-react';
import { useEffect, useState } from 'react';

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

  const Icon = isChecked ? () => <CheckSquare data-test-id="checkmark" /> : Square;

  return (
    <>
      <IconButton Icon={Icon} onClick={onToggleChanged} className={isChecked ? 'bg-green-100' : ''} {...props}>
        <span data-test-id="label" className="uppercase">
          {label}
        </span>
      </IconButton>
    </>
  );
}
