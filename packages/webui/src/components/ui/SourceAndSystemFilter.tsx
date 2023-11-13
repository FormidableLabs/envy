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
          className="absolute right-0 mt-2 z-50 bg-secondary border border-solid border-primary rounded-md p-3 w-96"
        >
          <div data-test-id="source-items-heading" className="font-bold p-2 uppercase">
            Sources
          </div>
          {hasSources ? (
            <ul data-test-id="source-items" className="flex flex-col gap-1">
              {connections.map(([name, isActive]) => {
                const isSelected = filters.sources.includes(name);
                const statusColor = isActive ? 'bg-green-400' : 'bg-red-300';
                return (
                  <li
                    key={name}
                    data-test-id="source-item"
                    className="cursor-pointer"
                    onClick={() => handleSourceSelection(name)}
                  >
                    <span
                      className={tw(
                        'flex flex-row items-center py-2 px-4 rounded hover:bg-green-200 uppercase font-semibold border border-transparent hover:border-gray-400',
                        isSelected && 'border-primary bg-green-200 hover:bg-green-200',
                      )}
                    >
                      <span data-test-id="status" className={tw('w-3 h-3 mr-2 rounded-full', statusColor)}></span>
                      <span className="flex-1">{name}</span>
                      {isSelected && <Check className="flex-0 w-6 h-6" />}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <span data-test-id="no-sources" className="opacity-50 p-2 italic">
              No sources connected
            </span>
          )}
          {hasSystems && <div data-test-id="items-divider" className="w-full border-b border-primary my-2"></div>}
          {hasSystems && (
            <div>
              <div data-test-id="system-items-heading" className="font-bold p-2 uppercase">
                Systems
              </div>
              <ul data-test-id="system-items" className="flex flex-col gap-1">
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
                          'flex flex-row items-center py-2 px-4 rounded hover:bg-green-200 uppercase font-semibold border border-transparent hover:border-gray-400',
                          isSelected && 'border-primary bg-green-200 hover:bg-green-200',
                        )}
                      >
                        {icon && <img src={icon} alt="" className="flex-0 mr-2 w-6 object-contain" />}
                        <span className="flex-1">{system.name}</span>
                        {isSelected && <Check className="flex-0  w-6 h-6" />}
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
