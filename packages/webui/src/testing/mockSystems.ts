import React from 'react';

import { getDefaultSystem, getRegisteredSystems } from '@/systems/registration';
import { System, Trace, TraceContext } from '@/types';

jest.mock('@/systems/registration');

export const mockSystems: System<unknown>[] = [
  new (class implements System<{ id: string; foo: string }> {
    name = 'Foo';
    isMatch(trace: Trace) {
      return trace.http?.host === 'www.foo.com';
    }
    getData(trace: Trace) {
      return {
        id: trace.id,
        foo: 'foo',
      };
    }
    getIconUri() {
      return `foo_icon`;
    }
    getTraceRowData({ trace }: TraceContext<{ id: string; foo: string }>) {
      return {
        data: `Foo data: ${trace.id}`,
      };
    }
    getRequestDetailComponent({ trace }: TraceContext<{ id: string; foo: string }>) {
      return React.createElement('div', null, `SystemRequestDetailsComponent: Foo ${trace.id}`);
    }
    getRequestBody({ trace }: TraceContext<{ id: string; foo: string }>) {
      return `transformed_${trace.http?.requestBody}_${trace.id}`;
    }
    getResponseDetailComponent({ trace }: TraceContext<{ id: string; foo: string }>) {
      return React.createElement('div', null, `SystemResponseDetailsComponent: Foo ${trace.id}`);
    }
    getResponseBody({ trace }: TraceContext<{ id: string; foo: string }>) {
      return `transformed_${trace.http?.responseBody}_${trace.id}`;
    }
  })(),
  new (class implements System<{ bar: string }> {
    name = 'Bar';
    isMatch(trace: Trace) {
      return trace.http?.host === 'www.bar.com';
    }
    getData(trace: Trace) {
      return {
        id: trace.id,
        bar: 'bar',
      };
    }
    getIconUri() {
      return `bar_icon`;
    }
    getTraceRowData({ trace }: TraceContext<{ bar: string }>) {
      return {
        data: `Bar data: ${trace.id}`,
      };
    }
    getRequestDetailComponent({ trace }: TraceContext<{ bar: string }>) {
      return React.createElement('div', null, `SystemRequestDetailsComponent: Bar ${trace.id}`);
    }
    getRequestBody({ trace }: TraceContext<{ bar: string }>) {
      return `transformed_${trace.http?.requestBody}_${trace.id}`;
    }
    getResponseDetailComponent({ trace }: TraceContext<{ bar: string }>) {
      return React.createElement('div', null, `SystemResponseDetailsComponent: Bar ${trace.id}`);
    }
    getResponseBody({ trace }: TraceContext<{ bar: string }>) {
      return `transformed_${trace.http?.responseBody}_${trace.id}`;
    }
  })(),
  new (class implements System<null> {
    name = 'Fallbacks';
    isMatch(trace: Trace) {
      return trace.http?.host === 'www.fallback.com';
    }
    getData() {
      return null;
    }
    getIconUri() {
      return null;
    }
    getTraceRowData() {
      return null;
    }
    getRequestDetailComponent() {
      return null;
    }
    getRequestBody() {
      return null;
    }
    getResponseDetailComponent() {
      return null;
    }
    getResponseBody() {
      return null;
    }
  })(),
  new (class implements System<null> {
    name = 'OddNumbers';
    isMatch(trace: Trace) {
      return parseInt(trace.id) % 2 === 1;
    }
  })(),
];

const mockDefaultSystem = new (class implements System<null> {
  name = 'Default';
  isMatch() {
    return true;
  }
  getData() {
    return null;
  }
  getIconUri() {
    return 'default_icon';
  }
  getTraceRowData() {
    return null;
  }
  getRequestDetailComponent() {
    return null;
  }
  getRequestBody({ trace }: TraceContext) {
    return `default_${trace.http?.requestBody}_${trace.id}`;
  }
  getResponseDetailComponent() {
    return null;
  }
  getResponseBody({ trace }: TraceContext) {
    return `default_${trace.http?.responseBody}_${trace.id}`;
  }
})();

export function setupMockSystems(registeredSystems = mockSystems) {
  jest.mocked(getRegisteredSystems).mockReturnValue(registeredSystems);
  jest.mocked(getDefaultSystem).mockReturnValue(mockDefaultSystem);
}
