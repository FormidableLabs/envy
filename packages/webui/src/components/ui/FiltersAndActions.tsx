import { useEffect, useState } from 'react';
import { HiTrash } from 'react-icons/hi';

import { DropDown, IconButton, SearchInput } from '@/components';
import useApplication from '@/hooks/useApplication';
import { getDefaultSystem, getRegisteredSystems } from '@/systems/registration';

export default function FiltersAndActions() {
  const { filterTraces, clearTraces } = useApplication();
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    filterTraces(selectedSystems, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSystems, filter]);

  const defaultSystem = getDefaultSystem();
  const systems = getRegisteredSystems();

  function clearData() {
    clearTraces();
  }

  function handleSystemsChange(value: string[]) {
    setSelectedSystems(value);
  }

  function handleFilterChange(value: string) {
    setFilter(value);
  }

  return (
    <span className="flex flex-row items-center gap-2">
      {systems.length > 0 && (
        <DropDown
          className="w-60"
          focusKey="S"
          placeholder="Systems..."
          label="Systems:"
          multiSelect
          items={systems.map(x => ({
            icon: x.getIconBase64?.(null) ?? defaultSystem.getIconBase64(),
            value: x.name,
          }))}
          onChange={handleSystemsChange}
        />
      )}

      <SearchInput className="w-96" focusKey="K" placeholder="Filter..." onChange={handleFilterChange} />

      <IconButton Icon={HiTrash} type="ghost" onClick={clearData}>
        Clear
      </IconButton>
    </span>
  );
}
