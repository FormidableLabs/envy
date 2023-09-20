import { webcrypto } from 'node:crypto';

import { nanoid } from '@envyjs/core';

export const generateId = nanoid(webcrypto as any);
