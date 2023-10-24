import { Ref, RefObject, forwardRef, useRef, useState } from 'react';

import useClickAway from '@/hooks/useClickAway';
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';
import usePlatform from '@/hooks/usePlatform';
import { tw } from '@/utils';

import IconButton from './IconButton';

export type MenuItem = {
  label: string;
  description?: string;
  callback: () => void;
};

type MenuProps = React.HTMLAttributes<HTMLDivElement> & {
  Icon?: React.FC<any>;
  label?: string;
  items: MenuItem[];
  focusKey?: string;
};

function Menu({ Icon, label, items, className, focusKey, ...props }: MenuProps, ref: Ref<HTMLDivElement>) {
  const { isMac, specialKey } = usePlatform();
  const [isOpen, setIsOpen] = useState(false);

  useKeyboardShortcut([
    {
      condition: !!focusKey,
      predicate: e => (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === focusKey?.toLowerCase(),
      callback: () => {
        setIsOpen(true);
      },
    },
    {
      predicate: e => e.key.toLowerCase() === 'escape',
      callback: () => {
        setIsOpen(false);
      },
    },
  ]);

  const dropDownFieldRef = useRef<HTMLDivElement>(null);
  const finalRef = (ref || dropDownFieldRef) as RefObject<HTMLDivElement>;

  useClickAway(finalRef, () => setIsOpen(false));

  function handleSelection(item: MenuItem) {
    item.callback();
    setIsOpen(false);
  }

  return (
    <div ref={finalRef} className={tw('relative', className)} {...props}>
      <IconButton
        role="menu"
        className={tw('', isOpen && 'bg-neutral hover:shadow-none')}
        Icon={Icon}
        onClick={() => setIsOpen(curr => !curr)}
      >
        {label}
      </IconButton>
      {isOpen && (
        <div data-test-id="menu-items" className="absolute right-0 mt-2 z-50 w-56">
          <ul className="shadow-lg py-1 divide-y divide-gray-100 rounded-md bg-neutral ring-1 ring-primary">
            {items.map((x: MenuItem) => {
              return (
                <li
                  key={x.label}
                  data-test-id="menu-items-item"
                  className="cursor-pointer py-2 px-4 hover:bg-gray-100"
                  onClick={() => handleSelection(x)}
                >
                  <div className="flex flex-col">
                    <div data-test-id="label" className="block">
                      {x.label}
                    </div>
                    {x.description && (
                      <div data-test-id="description" className="block text-xs">
                        {x.description}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {focusKey && specialKey && (
        <span data-test-id="focus-key" className="focus-key">
          {specialKey}
          {focusKey}
        </span>
      )}
    </div>
  );
}

export default forwardRef(Menu);
