import { TraceListItem } from '@/components/TraceListItem';
import { System } from '@/systems';
import { Trace } from '@/types';
import { pathAndQuery } from '@/utils';

const icon = new URL('Default.svg', import.meta.url);

export default class DefaultSystem implements System<null> {
  name = 'Default';

  isMatch() {
    return true;
  }

  getData(_: Trace) {
    return null;
  }

  getIconPath(_?: Trace) {
    return icon.pathname;
  }

  listComponent(trace: Trace) {
    const [path, qs] = pathAndQuery(trace);
    return <TraceListItem iconPath={this.getIconPath(trace)} hostName={trace.http?.host} path={path} data={qs} />;
  }

  requestDetailComponent(_: Trace) {
    return null;
  }

  transformRequestBody(trace: Trace) {
    return trace.http?.requestBody;
  }

  responseDetailComponent(_: Trace) {
    return null;
  }

  transformResponseBody(trace: Trace) {
    return trace.http?.responseBody;
  }
}
