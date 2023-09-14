import { Ref, RefObject, forwardRef, useEffect, useRef, useState } from 'react';
import { HiCheck, HiX } from 'react-icons/hi';

import useClickAway from '@/hooks/useClickAway';
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';
import usePlatform from '@/hooks/usePlatform';
import { tw } from '@/utils';

export type DropDownItem = {
  value: string;
  label?: string;
  icon?: string;
  isSelected?: boolean;
};

type DropDownProps = Omit<React.HTMLAttributes<HTMLSpanElement>, 'onChange'> & {
  items: DropDownItem[];
  multiSelect?: boolean;
  label?: string;
  focusKey?: string;
  onChange?: (value: string[]) => void;
};

function DropDown(
  { items, multiSelect = false, label, placeholder, className, focusKey, onChange, ...props }: DropDownProps,
  ref: Ref<HTMLSpanElement>,
) {
  const { isMac, specialKey } = usePlatform();
  const selectedItems = items.filter(x => x.isSelected);
  const [isOpen, setIsOpen] = useState(false);
  const [selection, setSelection] = useState(multiSelect ? selectedItems : [selectedItems[0]]);

  useKeyboardShortcut([
    {
      condition: !!focusKey,
      predicate: e => (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === focusKey?.toLowerCase(),
      callback: () => {
        setIsOpen(true);
      },
    },
    {
      condition: !!focusKey,
      predicate: e => e.key.toLowerCase() === 'escape',
      callback: () => {
        setIsOpen(false);
      },
    },
  ]);

  useEffect(() => {
    onChange?.(selection.map(x => x.value));
    return;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dropDownFieldRef = useRef<HTMLSpanElement>(null);
  const finalRef = (ref || dropDownFieldRef) as RefObject<HTMLSpanElement>;

  useClickAway(finalRef, () => setIsOpen(false));

  function handleSelection(item: DropDownItem) {
    if (multiSelect) {
      if (selection.some(x => x.value === item.value)) {
        setSelection([...selection.filter(x => x.value !== item.value)]);
      } else {
        setSelection([...selection, { ...item, isSelected: true }]);
      }
    } else {
      setSelection([{ ...item, isSelected: true }]);
    }
  }

  function clearSelection() {
    setSelection([]);
  }

  return (
    <span ref={finalRef} className={tw('flex input-container self-stretch', className)} {...props}>
      <span className="group absolute top-0 left-0 cursor-pointer w-full z-50">
        <span
          className={tw('relative flex input', isOpen && 'bg-white rounded-b-none hover:shadow-none')}
          onClick={() => setIsOpen(curr => !curr)}
        >
          {selection.length === 0 ? (
            <span className="opacity-50">{placeholder}</span>
          ) : (
            <>
              <span className="flex flex-row items-center gap-1">
                {label && <span className="mr-2">{label}</span>}
                {items.map(x => {
                  if (!selection.some(y => y.value === x.value)) return;
                  return (
                    <span key={x.value}>
                      {x.icon ? (
                        <img src={x.icon} alt="" className="flex-0 w-6 object-contain" />
                      ) : (
                        <>{x.label || x.value}</>
                      )}
                    </span>
                  );
                })}
              </span>
              <span className={tw('input-clear', isOpen && 'flex')} onClick={() => clearSelection()}>
                <HiX />
              </span>
            </>
          )}
        </span>
        <span className={tw('input w-full bg-white rounded-t-none', !isOpen && 'hidden')}>
          <ul className="flex flex-col gap-1">
            {items.map(x => {
              const isSelected = selection.some(y => y.value === x.value);
              return (
                <li key={x.value} onClick={() => handleSelection(x)}>
                  <span
                    className={tw(
                      'transition-all p-2 flex flex-row items-center rounded bg-white border border-transparent',
                      isSelected && 'bg-orange-100 border-orange-200',
                    )}
                  >
                    {x.icon && <img src={x.icon} alt="" className="flex-0 mr-2 w-6 object-contain" />}
                    <span className="flex-1">{x.label ?? x.value}</span>
                    {isSelected && <HiCheck className="flex-0  w-6 h-6" />}
                  </span>
                </li>
              );
            })}
          </ul>
        </span>
      </span>
      {focusKey && specialKey && (
        <span className="focus-key">
          {specialKey}
          {focusKey}
        </span>
      )}
    </span>
  );
}

export default forwardRef(DropDown);
