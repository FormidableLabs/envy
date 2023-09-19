import mockData from './mockData';

describe('mockData', () => {
  function expectContains(matcher: any) {
    expect(mockData).toEqual(expect.arrayContaining([expect.objectContaining(matcher)]));
  }

  it('should contain at least event', () => {
    expectContains({ id: expect.any(String) });
  });

  it('should contain at least one event with http request and response data', () => {
    expectContains({
      http: expect.objectContaining({
        method: expect.any(String),
        host: expect.any(String),
        port: expect.any(Number),
        statusCode: expect.any(Number),
        statusMessage: expect.any(String),
      }),
    });
  });

  it('should contain at least one event with http request data only', () => {
    expectContains({
      http: expect.objectContaining({
        method: expect.any(String),
        host: expect.any(String),
        port: expect.any(Number),
        statusCode: undefined,
        statusMessage: undefined,
      }),
    });
  });

  it('should contain at least one event with an HTTP 200 response', () => {
    expectContains({
      http: expect.objectContaining({
        statusCode: 200,
      }),
    });
  });

  it('should contain at least one event with an HTTP 404 response', () => {
    expectContains({
      http: expect.objectContaining({
        statusCode: 404,
      }),
    });
  });

  it('should contain at least one event with an HTTP 500 response', () => {
    expectContains({
      http: expect.objectContaining({
        statusCode: 500,
      }),
    });
  });
});
