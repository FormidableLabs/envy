import { Event } from '../event';

import { Meta } from './meta';

describe('meta', () => {
  it('should add the service name', () => {
    const event = {} as Event;
    const output = Meta(event, { serviceName: 'test-name' });
    expect(output.serviceName).toBe('test-name');
  });
});
