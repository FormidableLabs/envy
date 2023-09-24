import React from 'react';

import { getDefaultSystem, getRegisteredSystems } from '@/systems/registration';
import { System, Trace } from '@/types';

jest.mock('@/systems/registration');

const mockSystems: System<unknown>[] = [
  new (class implements System<{ id: string; foo: string }> {
    name = 'Foo';
    isMatch(trace: Trace) {
      return trace.http?.host === 'www.foo.com';
    }
    getIconBase64(trace: Trace | null) {
      return `foo_${trace?.id}_base64`;
    }
    getData(trace: Trace) {
      return {
        id: trace.id,
        foo: 'foo',
      };
    }
    getTraceRowData?(trace: Trace) {
      return {
        data: `Foo data: ${trace.id}`,
      };
    }
    requestDetailComponent(trace: Trace) {
      return React.createElement('div', null, `SystemRequestDetailsComponent: Foo ${trace.id}`);
    }
    transformRequestBody?(trace: Trace) {
      return `transformed_${trace.http?.requestBody}_${trace.id}`;
    }
    responseDetailComponent(trace: Trace) {
      return React.createElement('div', null, `SystemResponseDetailsComponent: Foo ${trace.id}`);
    }
    transformResponseBody?(trace: Trace) {
      return `transformed_${trace.http?.responseBody}_${trace.id}`;
    }
  })(),
  new (class implements System<{ bar: string }> {
    name = 'Bar';
    isMatch(trace: Trace) {
      return trace.http?.host === 'www.bar.com';
    }
    getIconBase64(trace: Trace | null) {
      return `bar_${trace?.id}_base64`;
    }
    getData(trace: Trace) {
      return {
        id: trace.id,
        bar: 'bar',
      };
    }
    getTraceRowData?(trace: Trace) {
      return {
        data: `Bar data: ${trace.id}`,
      };
    }
    requestDetailComponent(trace: Trace) {
      return React.createElement('div', null, `SystemRequestDetailsComponent: Bar ${trace.id}`);
    }
    transformRequestBody?(trace: Trace) {
      return `transformed_${trace.http?.requestBody}_${trace.id}`;
    }
    responseDetailComponent(trace: Trace) {
      return React.createElement('div', null, `SystemResponseDetailsComponent: Bar ${trace.id}`);
    }
    transformResponseBody?(trace: Trace) {
      return `transformed_${trace.http?.responseBody}_${trace.id}`;
    }
  })(),
  new (class implements System<null> {
    name = 'Fallbacks';
    isMatch(trace: Trace) {
      return trace.http?.host === 'www.fallback.com';
    }
    getIconBase64() {
      return null;
    }
    getData() {
      return null;
    }
    getTraceRowData?() {
      return null;
    }
    requestDetailComponent() {
      return null;
    }
    transformRequestBody?() {
      return null;
    }
    responseDetailComponent() {
      return null;
    }
    transformResponseBody?() {
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
  getIconBase64() {
    return 'default_base64';
  }
  getData() {
    return null;
  }
  getTraceRowData() {
    return null;
  }
  requestDetailComponent() {
    return null;
  }
  transformRequestBody(trace: Trace) {
    return `default_${trace.http?.requestBody}_${trace.id}`;
  }
  responseDetailComponent() {
    return null;
  }
  transformResponseBody(trace: Trace) {
    return `default_${trace.http?.responseBody}_${trace.id}`;
  }
})();

export function setupMockSystems() {
  jest.mocked(getRegisteredSystems).mockReturnValue(mockSystems);
  jest.mocked(getDefaultSystem).mockReturnValue(mockDefaultSystem);
}
