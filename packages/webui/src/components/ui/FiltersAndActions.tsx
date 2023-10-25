import { SearchInput } from '@/components';
import useApplication from '@/hooks/useApplication';

export default function FiltersAndActions() {
  const { setFilters } = useApplication();

  function handleSearchTermChange(value: string) {
    setFilters(curr => ({
      ...curr,
      searchTerm: value,
    }));
  }

  return <SearchInput className="w-72" onChange={handleSearchTermChange} />;
}
