import { HiTrash } from 'react-icons/hi';

import { IconButton, SearchInput } from '@/components';
import useApplication from '@/hooks/useApplication';

import SourceAndSystemFilter from './SourceAndSystemFilter';

export default function FiltersAndActions() {
  const { setFilters, clearTraces } = useApplication();

  function clearData() {
    clearTraces();
  }

  function handleSearchTermChange(value: string) {
    setFilters(curr => ({
      ...curr,
      searchTerm: value,
    }));
  }

  return (
    <span className="flex flex-row items-center gap-2">
      <SourceAndSystemFilter data-test-id="sources-and-systems" className="w-96" />

      <SearchInput className="w-72" focusKey="K" placeholder="Search term..." onChange={handleSearchTermChange} />

      <IconButton Icon={HiTrash} type="ghost" onClick={clearData}>
        Clear
      </IconButton>
    </span>
  );
}
