import { webcrypto } from 'node:crypto';

import { nanoid } from '@envy/core';

export const generateId = nanoid(webcrypto as any);
