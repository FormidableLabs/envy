import { forwardRef, Ref } from 'react';
import { HiOutlineSearchCircle } from 'react-icons/hi';

import Input, { InputProps } from './Input';

type SearchInputProps = Omit<InputProps, 'Icon'>;

function SearchInput(props: SearchInputProps, ref: Ref<HTMLInputElement>) {
  return (
    <Input ref={ref} type="search" Icon={HiOutlineSearchCircle} {...props} />
  );
}

export default forwardRef(SearchInput);
