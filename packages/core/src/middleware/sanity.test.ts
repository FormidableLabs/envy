import { Event } from '../event';

import { Sanity } from './sanity';

describe('sanity', () => {
  it('should not modify the event if http is not defined', () => {
    const event = {
      id: '1',
    } as Event;

    const output = Sanity(event, { serviceName: 'test-name' });
    expect(output).toEqual({ id: '1' });
  });

  it('should not modify the event if the host doesnt match', () => {
    const event = {
      id: '2',
      http: {
        host: 'bobo.io',
      },
    } as Event;

    const output = Sanity(event, { serviceName: 'test-name' });
    expect(output).toEqual({
      id: '2',
      http: {
        host: 'bobo.io',
      },
    });
  });

  it('should parse the query from a GET method', () => {
    const event = {
      id: '2',
      http: {
        host: 'test.sanity.io',
        method: 'GET',
        path: 'v2021-10-21/data/query/production?query=*%5B_type%20%3D%3D%20%27product%27%5D%7B_id%2C%20name%2C%20description%2C%20%22categories%22%3A%20categories%5B%5D-%3E%7B_id%7D%2C%20%22variants%22%3A%20variants%5B%5D-%3E%7B_id%2C%20name%2C%20price%7D%7D',
      },
    } as Event;

    const output = Sanity(event, { serviceName: 'test-name' });
    expect(output).toEqual({
      ...event,
      sanity: {
        query:
          '*[_type == \'product\']{_id, name, description, "categories": categories[]->{_id}, "variants": variants[]->{_id, name, price}}',
        queryType: 'product',
      },
    });
  });

  it('should parse the query from a POST body', () => {
    const event: Event = {
      id: '2',
      timestamp: 123333,
      http: {
        host: 'test.sanity.io',
        method: 'POST',
        requestHeaders: {
          'content-type': 'application/json',
        },
        requestBody: JSON.stringify({
          query:
            '*[_type == \'cookies\']{_id, name, description, "categories": categories[]->{_id}, "variants": variants[]->{_id, name, price}}',
        }),
        url: '',
        path: '',
        port: 80,
      },
    };

    const output = Sanity(event, { serviceName: 'test-name' });
    expect(output).toEqual({
      ...event,
      sanity: {
        query:
          '*[_type == \'cookies\']{_id, name, description, "categories": categories[]->{_id}, "variants": variants[]->{_id, name, price}}',
        queryType: 'cookies',
      },
    });
  });
});
