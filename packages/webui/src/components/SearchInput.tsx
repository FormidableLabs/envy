import { Ref, forwardRef } from 'react';
import { HiOutlineSearch } from 'react-icons/hi';

import Input, { InputProps } from './Input';

type SearchInputProps = Omit<InputProps, 'Icon'>;

function SearchInput(props: SearchInputProps, ref: Ref<HTMLInputElement>) {
  return (
    <Input
      ref={ref}
      type="search"
      Icon={HiOutlineSearch}
      id="search"
      name="search"
      focusKey="K"
      placeholder="Search"
      {...props}
    />
  );
}

export default forwardRef(SearchInput);
