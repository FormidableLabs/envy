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

  it('should return `null` for `requestDetailComponent`', () => {
    const instance = new DefaultSystem();
    expect(instance.requestDetailComponent()).toBe(null);
  });

  it('should return request body from trace for `transformRequestBody`', () => {
    const trace = {
      http: {
        requestBody: 'mock_request_body',
      },
    } as Trace;

    const instance = new DefaultSystem();
    expect(instance.transformRequestBody(trace)).toBe('mock_request_body');
  });

  it('should return `null` for `responseDetailComponent`', () => {
    const instance = new DefaultSystem();
    expect(instance.responseDetailComponent()).toBe(null);
  });

  it('should return response body from trace for `transformResponseBody`', () => {
    const trace = {
      http: {
        responseBody: 'mock_response_body',
      },
    } as Trace;

    const instance = new DefaultSystem();
    expect(instance.transformResponseBody(trace)).toBe('mock_response_body');
  });
});
