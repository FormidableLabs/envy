import { Trace } from '@/types';

import DefaultSystem from './Default';

describe('DefaultSystem', () => {
  it('should be called "Default"', () => {
    const instance = new DefaultSystem();
    expect(instance.name).toEqual('Default');
  });

  it('should always be a match', () => {
    const instance = new DefaultSystem();
    expect(instance.isMatch()).toBe(true);
  });

  it('should return the expected icon', () => {
    const instance = new DefaultSystem();
    expect(instance.getIconUri()).toEqual(expect.any(String));
  });

  it('should return `null` for `getData`', () => {
    const instance = new DefaultSystem();
    expect(instance.getData()).toBe(null);
  });

  it('should return `null` for  `getTraceRowData', () => {
    const instance = new DefaultSystem();
    expect(instance.getTraceRowData()).toBe(null);
  });

  it('should return `null` for `getRequestDetailComponent`', () => {
    const instance = new DefaultSystem();
    expect(instance.getRequestDetailComponent()).toBe(null);
  });

  it('should return request body from trace for `getRequestBody`', () => {
    const trace = {
      http: {
        requestBody: 'mock_request_body',
      },
    } as Trace;

    const instance = new DefaultSystem();
    expect(instance.getRequestBody({ trace, data: null })).toBe('mock_request_body');
  });

  it('should return `null` for `getResponseDetailComponent`', () => {
    const instance = new DefaultSystem();
    expect(instance.getResponseDetailComponent()).toBe(null);
  });

  it('should return response body from trace for `getResponseBody`', () => {
    const trace = {
      http: {
        responseBody: 'mock_response_body',
      },
    } as Trace;

    const instance = new DefaultSystem();
    expect(instance.getResponseBody({ trace, data: null })).toBe('mock_response_body');
  });
});
