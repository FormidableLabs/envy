import { Ref, RefObject, forwardRef, useRef, useState } from 'react';
import { HiCheck, HiOutlineFilter, HiX } from 'react-icons/hi';

import useApplication from '@/hooks/useApplication';
import useClickAway from '@/hooks/useClickAway';
import { getDefaultSystem, getRegisteredSystems } from '@/systems/registration';
import { tw } from '@/utils';

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

  function clearSelection() {
    setFilters(curr => ({
      ...curr,
      sources: [],
      systems: [],
    }));
  }

  const defaultIcon = getDefaultSystem().getIconUri();
  const systems = getRegisteredSystems();
  const hasFilters = filters.sources.length + filters.systems.length > 0;

  const hasSources = connections.length > 0;
  const hasSystems = systems.length > 0;

  const placeholder = hasSystems ? 'Sources and systems...' : 'Sources...';

  const dropDownOptionsClasses = hasSystems
    ? 'rounded-tr-none w-[45rem] grid-cols-[1fr_1px_1fr] gap-4 p-4'
    : 'rounded-t-none w-full grid-cols-1';

  const currentSelections = [];
  if (filters.sources.length > 0) {
    currentSelections.push(`${filters.sources.length} source${filters.sources.length > 1 ? 's' : ''}`);
  }
  if (filters.systems.length > 0) {
    currentSelections.push(`${filters.systems.length} system${filters.systems.length > 1 ? 's' : ''}`);
  }

  return (
    <div ref={finalRef} className={tw('flex input-container self-stretch', className)} {...props}>
      <div className="group w-full z-50">
        <div
          role="listbox"
          data-test-item="filters"
          className={tw(
            'cursor-pointer relative flex items-center input-container input pl-9',
            isOpen && 'bg-white rounded-b-none hover:shadow-none',
          )}
          onClick={() => setIsOpen(curr => !curr)}
        >
          <HiOutlineFilter />
          {!hasFilters ? (
            <span className="opacity-50">{placeholder}</span>
          ) : (
            <>
              <span data-test-id="selection-summary">{currentSelections.join(', ')}</span>
              <span data-test-id="input-clear" className={tw('input-clear', isOpen && 'flex')} onClick={clearSelection}>
                <HiX />
              </span>
            </>
          )}
        </div>
        {isOpen && (
          <div
            data-test-id="filter-options"
            className={tw(
              'absolute top-full right-0 select-none',
              'grid grid-rows-1 input bg-white',
              dropDownOptionsClasses,
            )}
          >
            <div>
              {hasSystems && (
                <div data-test-id="source-items-heading" className="font-bold p-2">
                  Sources
                </div>
              )}
              {hasSources ? (
                <ul data-test-id="source-items" className="flex flex-col gap-1">
                  {connections.map(([name, isActive]) => {
                    const isSelected = filters.sources.includes(name);
                    const statusColor = isActive ? 'bg-green-300' : 'bg-red-300';
                    return (
                      <li
                        key={name}
                        data-test-id="source-item"
                        className="cursor-pointer"
                        onClick={() => handleSourceSelection(name)}
                      >
                        <span
                          className={tw(
                            'transition-all p-2 flex flex-row items-center rounded bg-white border border-transparent hover:bg-slate-100',
                            isSelected && 'bg-slate-100 border-slate-200 hover:bg-slate-50',
                          )}
                        >
                          <span data-test-id="status" className={tw('w-3 h-3 mr-2 rounded-full', statusColor)}></span>
                          <span className="flex-1">{name}</span>
                          {isSelected && <HiCheck className="flex-0 w-6 h-6" />}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <span data-test-id="no-sources" className="opacity-50 p-2 italic">
                  No sources connected...
                </span>
              )}
            </div>
            {hasSystems && <div data-test-id="items-divider" className="w-px bg-slate-200"></div>}
            {hasSystems && (
              <div>
                <div data-test-id="system-items-heading" className="font-bold p-2">
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
                            'transition-all p-2 flex flex-row items-center rounded bg-white border border-transparent hover:bg-slate-100',
                            isSelected && 'bg-slate-100 border-slate-200 hover:bg-slate-50',
                          )}
                        >
                          {icon && <img src={icon} alt="" className="flex-0 mr-2 w-6 object-contain" />}
                          <span className="flex-1">{system.name}</span>
                          {isSelected && <HiCheck className="flex-0  w-6 h-6" />}
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
    </div>
  );
}

export default forwardRef(SourceAndSystemFilter);
