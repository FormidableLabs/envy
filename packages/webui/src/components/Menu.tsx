import { Ref, RefObject, forwardRef, useRef, useState } from 'react';

import useClickAway from '@/hooks/useClickAway';
import useKeyboardShortcut from '@/hooks/useKeyboardShortcut';
import usePlatform from '@/hooks/usePlatform';
import { tw } from '@/utils';

import Button from './Button';

export type MenuItem = {
  label: string;
  description?: string;
  callback: (e: React.MouseEvent) => void;
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

  function handleSelection(e: React.MouseEvent, item: MenuItem) {
    item.callback(e);
    setIsOpen(false);
  }

  return (
    <div ref={finalRef} className={tw('relative', className)} {...props}>
      <Button
        role="menu"
        className={tw('', isOpen && 'bg-apple-400 hover:shadow-none')}
        Icon={Icon}
        onClick={() => setIsOpen(curr => !curr)}
      >
        {label}
      </Button>
      {isOpen && (
        <div data-test-id="menu-items" className="absolute right-0 mt-2 z-50 w-56">
          <ul className="shadow-lg py-1 divide-y divide-manatee-400 rounded-md bg-manatee-100 border border-manatee-400">
            {items.map((x: MenuItem) => {
              return (
                <li
                  key={x.label}
                  data-test-id="menu-items-item"
                  className="cursor-pointer py-2 px-4 hover:bg-apple-200"
                  onClick={e => handleSelection(e, x)}
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
