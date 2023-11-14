import { Search } from 'lucide-react';
import { Ref, forwardRef } from 'react';

import Input, { InputProps } from './Input';

type SearchInputProps = Omit<InputProps, 'Icon'>;

function SearchInput({ className, ...props }: SearchInputProps, ref: Ref<HTMLInputElement>) {
  return (
    <div className={className}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Input
        ref={ref}
        type="search"
        Icon={Search}
        id="search"
        name="search"
        focusKey="K"
        placeholder="Search"
        {...props}
      />
    </div>
  );
}

export default forwardRef(SearchInput);
