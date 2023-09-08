import { useEffect, useState } from 'react';
import { HiTrash } from 'react-icons/hi';

import { DropDown, IconButton, SearchInput } from '@/components/ui';
import useApplication from '@/hooks/useApplication';
import { systems } from '@/systems';

export default function FiltersAndActions() {
  const { filterConnections, clearConnections } = useApplication();
  const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    filterConnections(selectedSystems, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSystems, filter]);

  const systemsExceptDefault = systems.filter(x => x.name !== 'Default');

  function clearData() {
    clearConnections();
  }

  function handleSystemsChange(value: string[]) {
    setSelectedSystems(value);
  }

  function handleFilterChange(value: string) {
    setFilter(value);
  }

  return (
    <span className="flex flex-row items-center gap-2">
      {systemsExceptDefault.length > 0 && (
        <DropDown
          className="w-60"
          focusKey="S"
          placeholder="Systems..."
          label="Systems:"
          multiSelect
          items={systemsExceptDefault.map(x => ({
            icon: x.getIconPath?.(),
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
