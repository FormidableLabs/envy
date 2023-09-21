import { types as utilTypes } from 'util';

import { wrap as _wrap } from 'shimmer';

// ESM handling of wrapping
export const wrap: typeof _wrap = (moduleExports, name, wrapper) => {
  if (!utilTypes.isProxy(moduleExports)) {
    return _wrap(moduleExports, name, wrapper);
  } else {
    const wrapped = _wrap(Object.assign({}, moduleExports), name, wrapper);

    return Object.defineProperty(moduleExports, name, {
      value: wrapped,
    });
  }
};
