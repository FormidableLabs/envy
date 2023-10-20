import { SearchInput } from '@/components';
import useApplication from '@/hooks/useApplication';

import SourceAndSystemFilter from './SourceAndSystemFilter';

export default function FiltersAndActions() {
  const { setFilters } = useApplication();

  function handleSearchTermChange(value: string) {
    setFilters(curr => ({
      ...curr,
      searchTerm: value,
    }));
  }

  return (
    <span className="flex flex-row items-center gap-2">
      <SourceAndSystemFilter className="w-52" data-test-id="sources-and-systems" />
      <SearchInput className="w-48 lg:w-72" onChange={handleSearchTermChange} />
    </span>
  );
}
