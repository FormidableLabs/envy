import { Ref, RefObject, forwardRef, useRef, useState } from 'react';
import { IconType } from 'react-icons';

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
  Icon?: IconType;
  label: string;
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
    <div ref={finalRef} className={tw('flex input-container', className)} {...props}>
      <span className="w-full relative group cursor-pointer z-50">
        <IconButton
          role="menu"
          type="ghost"
          className={tw('w-full h-10 relative flex', isOpen && 'bg-white rounded-b-none hover:shadow-none')}
          Icon={Icon}
          onClick={() => setIsOpen(curr => !curr)}
        >
          {label}
        </IconButton>
        {isOpen && (
          <span data-test-id="menu-items" className="input w-full absolute top-full left-0 bg-white rounded-t-none">
            <ul className="flex flex-col gap-1">
              {items.map((x: MenuItem) => {
                return (
                  <li data-test-id="menu-items-item" key={x.label} onClick={() => handleSelection(x)}>
                    <span className="transition-all p-2 flex flex-row items-center rounded bg-white border border-transparent hover:bg-slate-100">
                      <span className="flex-1">
                        <span data-test-id="label" className="block">
                          {x.label}
                        </span>
                        {x.description && (
                          <span data-test-id="description" className="block text-xs">
                            {x.description}
                          </span>
                        )}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </span>
        )}
      </span>
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
