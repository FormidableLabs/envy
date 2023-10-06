import { Event } from '../event';

import { Graphql } from './graphql';

describe('graphql', () => {
  it('should not modify the event if http is not defined', () => {
    const event = {
      id: '1',
    } as Event;

    const output = Graphql(event, { serviceName: 'test-name' });
    expect(output).toEqual({ ...event });
  });

  it('should not modify a GET request if the query is not present', () => {
    const event: Event = {
      id: '2',
      timestamp: 123333,
      http: {
        method: 'GET',
        host: 'bobo.io',
        url: 'http://bobo.io?query=mushmush',
        path: '',
        port: 80,
        requestHeaders: {},
      },
    };

    const output = Graphql(event, { serviceName: 'test-name' });
    expect(output).toEqual({ ...event });
  });

  it('should not modify a POST request if the content-type is not correct', () => {
    const event: Event = {
      id: '2',
      timestamp: 123333,
      http: {
        method: 'POST',
        host: 'bobo.io',
        url: 'http://bobo.io/',
        path: '',
        port: 80,
        requestHeaders: {
          'content-type': 'text/html',
        },
        requestBody: JSON.stringify({
          query: 'query GreetingQuery ($test: String) { hello (name: $test) { value } }',
          operationName: 'GreetingQuery',
          variables: { test: 'value' },
        }),
      },
    };

    const output = Graphql(event, { serviceName: 'test-name' });
    expect(output).toEqual({ ...event });
  });

  it('should parse the query from a GET request', () => {
    const event: Event = {
      id: '2',
      timestamp: 123333,
      http: {
        method: 'GET',
        host: 'bobo.io',
        url: 'http://bobo.io/?query=query%20{%20hello%20{%20value%20}%20}',
        path: '',
        port: 80,
        requestHeaders: {},
      },
    };

    const output = Graphql(event, { serviceName: 'test-name' });
    expect(output.graphql).toEqual({
      operationType: 'query',
      query: 'query { hello { value } }',
    });
  });

  it('should parse an anonymous query from a GET request', () => {
    const event: Event = {
      id: '2',
      timestamp: 123333,
      http: {
        method: 'GET',
        host: 'bobo.io',
        url: 'http://bobo.io/?query={%20hello%20{%20value%20}%20}',
        path: '',
        port: 80,
        requestHeaders: {},
      },
    };

    const output = Graphql(event, { serviceName: 'test-name' });
    expect(output.graphql).toEqual({
      operationType: 'query',
      query: '{ hello { value } }',
    });
  });

  it('should parse the operation name and variables from a GET request', () => {
    const event: Event = {
      id: '2',
      timestamp: 123333,
      http: {
        method: 'GET',
        host: 'bobo.io',
        url: 'http://bobo.io/?query=query%20GreetingQuery%20{%20hello%20{%20value%20}%20}&operationName=GreetingQuery&variables=%7B%20%22test%22%3A%20%22value%22%20%7D',
        path: '',
        port: 80,
        requestHeaders: {},
      },
    };

    const output = Graphql(event, { serviceName: 'test-name' });
    expect(output.graphql).toEqual({
      operationType: 'query',
      operationName: 'GreetingQuery',
      query: 'query GreetingQuery { hello { value } }',
      variables: {
        test: 'value',
      },
    });
  });

  it('should parse the query from an anonymous POST request', () => {
    const event: Event = {
      id: '2',
      timestamp: 123333,
      http: {
        method: 'POST',
        host: 'bobo.io',
        url: 'http://bobo.io/',
        path: '',
        port: 80,
        requestHeaders: {
          'content-type': 'application/json',
        },
        requestBody: JSON.stringify({
          query: '{ hello { value } }',
        }),
      },
    };

    const output = Graphql(event, { serviceName: 'test-name' });
    expect(output.graphql).toEqual({
      operationType: 'query',
      query: '{ hello { value } }',
    });
  });

  it('should parse the operation name and variables from a POST request', () => {
    const event: Event = {
      id: '2',
      timestamp: 123333,
      http: {
        method: 'POST',
        host: 'bobo.io',
        url: 'http://bobo.io/',
        path: '',
        port: 80,
        requestHeaders: {
          'content-type': 'application/json',
        },
        requestBody: JSON.stringify({
          query: 'mutation MakeGreeting ($test: String) { hello (name: $test) { value } }',
          operationName: 'MakeGreeting',
          variables: { test: 'value' },
        }),
      },
    };

    const output = Graphql(event, { serviceName: 'test-name' });
    expect(output.graphql).toEqual({
      operationType: 'mutation',
      operationName: 'MakeGreeting',
      query: 'mutation MakeGreeting ($test: String) { hello (name: $test) { value } }',
      variables: {
        test: 'value',
      },
    });
  });
});
