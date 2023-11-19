import { System, TraceContext } from '@/types';

export default class DefaultSystem implements System<null> {
  name = 'Default';

  isMatch() {
    return true;
  }

  getData() {
    return null;
  }

  getIconUri() {
    return 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MjAiCmhlaWdodD0iNDIwIiBzdHJva2U9IiMyMjIyMjIiIGZpbGw9Im5vbmUiPgo8cGF0aCBzdHJva2Utd2lkdGg9IjI2IgpkPSJNMjA5LDE1YTE5NSwxOTUgMCAxLDAgMiwweiIvPgo8cGF0aCBzdHJva2Utd2lkdGg9IjE4IgpkPSJtMjEwLDE1djM5MG0xOTUtMTk1SDE1TTU5LDkwYTI2MCwyNjAgMCAwLDAgMzAyLDAgbTAsMjQwIGEyNjAsMjYwIDAgMCwwLTMwMiwwTTE5NSwyMGEyNTAsMjUwIDAgMCwwIDAsMzgyIG0zMCwwIGEyNTAsMjUwIDAgMCwwIDAtMzgyIi8+Cjwvc3ZnPg==';
  }

  getSearchKeywords() {
    return [];
  }

  getTraceRowData() {
    return null;
  }

  getRequestDetailComponent() {
    return null;
  }

  getRequestBody({ trace }: TraceContext) {
    // no transform; just return the response body
    return trace.http?.requestBody;
  }

  getResponseDetailComponent() {
    return null;
  }

  getResponseBody({ trace }: TraceContext) {
    // no transform; just return the response body
    return trace.http?.responseBody;
  }
}
