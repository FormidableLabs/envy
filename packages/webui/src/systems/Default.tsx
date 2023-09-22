import { System, Trace } from '@/types';

const icon = new URL('Default.svg', import.meta.url);

export default class DefaultSystem implements System<null> {
  name = 'Default';

  isMatch() {
    return true;
  }

  getIconPath() {
    return icon.pathname;
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
    return trace.http?.requestBody;
  }

  responseDetailComponent() {
    return null;
  }

  transformResponseBody(trace: Trace) {
    return trace.http?.responseBody;
  }
}
