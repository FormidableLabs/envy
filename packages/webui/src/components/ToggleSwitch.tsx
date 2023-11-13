import { CheckSquare, Square } from 'lucide-react';
import { useEffect, useState } from 'react';

import Button, { ButtonProps } from './Button';

type ToggleSwitchProps = Omit<ButtonProps, 'onChange'> & {
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

  const Icon = isChecked ? CheckSquare : Square;

  return (
    <>
      <Button Icon={Icon} onClick={onToggleChanged} selected={isChecked} {...props}>
        <span data-test-id="label" className="uppercase">
          {label}
        </span>
      </Button>
    </>
  );
}
