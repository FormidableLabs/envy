import { Check, Filter } from 'lucide-react';
import { Ref, RefObject, forwardRef, useRef, useState } from 'react';

import useApplication from '@/hooks/useApplication';
import useClickAway from '@/hooks/useClickAway';
import { getDefaultSystem, getRegisteredSystems } from '@/systems/registration';
import { tw } from '@/utils';

import Button from '../Button';

type SourceAndSystemFilterProps = React.HTMLAttributes<HTMLDivElement>;

function SourceAndSystemFilter({ className, ...props }: SourceAndSystemFilterProps, ref: Ref<HTMLDivElement>) {
  const dropDownFieldRef = useRef<HTMLDivElement>(null);
  const finalRef = (ref || dropDownFieldRef) as RefObject<HTMLDivElement>;

  const [isOpen, setIsOpen] = useState(false);
  const { connections, filters, setFilters } = useApplication();
  useClickAway(finalRef, () => setIsOpen(false));

  function handleSourceSelection(name: string) {
    setFilters(curr => {
      const newSources = curr.sources.includes(name) ? curr.sources.filter(x => x !== name) : [...curr.sources, name];
      return {
        ...curr,
        sources: newSources,
      };
    });
  }

  function handleSystemSelection(name: string) {
    setFilters(curr => {
      const newSystems = curr.systems.includes(name) ? curr.systems.filter(x => x !== name) : [...curr.systems, name];
      return {
        ...curr,
        systems: newSystems,
      };
    });
  }

  const defaultIcon = getDefaultSystem().getIconUri();
  const systems = getRegisteredSystems();
  const hasFilters = filters.sources.length + filters.systems.length > 0;

  const hasSources = connections.length > 0;
  const hasSystems = systems.length > 0;

  return (
    <div ref={finalRef} data-test-id="sources-and-systems" className={tw('relative', className)} {...props}>
      <Button role="listbox" selected={isOpen || hasFilters} Icon={Filter} onClick={() => setIsOpen(curr => !curr)} />
      {isOpen && (
        <div
          data-test-id="filter-options"
          className="absolute right-0 mt-2 p-4 w-96 z-50 bg-manatee-100 border border-solid border-manatee-600 rounded-md text-sm uppercase"
        >
          <div data-test-id="source-items-heading" className="font-bold py-2">
            Sources
          </div>
          {hasSources ? (
            <ul data-test-id="source-items" className="flex flex-col gap-2">
              {connections.map(([name, isActive]) => {
                const isSelected = filters.sources.includes(name);
                const statusColor = isActive ? 'bg-apple-400' : 'bg-red-300';
                return (
                  <li
                    key={name}
                    data-test-id="source-item"
                    className="cursor-pointer"
                    onClick={() => handleSourceSelection(name)}
                  >
                    <span
                      className={tw(
                        'flex flex-row items-center py-2 px-3 rounded hover:bg-apple-200 hover:text-apple-900 font-semibold',
                        isSelected && 'border-manatee-500 bg-manatee-300',
                      )}
                    >
                      <span data-test-id="status" className={tw('w-3 h-3 mr-2 rounded-full', statusColor)}></span>
                      <span className="flex-1">{name}</span>
                      {isSelected && <Check className="flex-0 w-4 h-4" />}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <span data-test-id="no-sources" className="opacity-50 p-2 pl-3 italic">
              No sources connected
            </span>
          )}
          {hasSystems && <div data-test-id="items-divider" className="w-full border-b border-manatee-600 my-2"></div>}
          {hasSystems && (
            <div>
              <div data-test-id="system-items-heading" className="font-bold py-2">
                Systems
              </div>
              <ul data-test-id="system-items" className="flex flex-col gap-2">
                {systems.map(system => {
                  const isSelected = filters.systems.includes(system.name);
                  const icon = system.getIconUri?.() ?? defaultIcon;
                  return (
                    <li
                      key={system.name}
                      data-test-id="system-item"
                      className="cursor-pointer"
                      onClick={() => handleSystemSelection(system.name)}
                    >
                      <span
                        className={tw(
                          'flex flex-row items-center py-2 px-3 rounded hover:bg-apple-200 hover:text-apple-900 font-semibold',
                          isSelected && 'border-manatee-500 bg-manatee-300',
                        )}
                      >
                        {icon && <img src={icon} alt="" className="flex-0 mr-2 h-4 w-4 object-contain" />}
                        <span className="flex-1">{system.name}</span>
                        {isSelected && <Check className="flex-0 w-4 h-4" />}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default forwardRef(SourceAndSystemFilter);
