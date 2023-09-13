import { RequestRowData } from '@/components/RequestRowData';
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

  listComponent(connection: Trace) {
    const [path, qs] = pathAndQuery(connection);
    return (
      <RequestRowData iconPath={this.getIconPath(connection)} hostName={connection.req.host} path={path} data={qs} />
    );
  }

  requestDetailComponent(_: Trace) {
    return null;
  }

  transformRequestBody(connection: Trace) {
    return connection.req?.body;
  }

  responseDetailComponent(_: Trace) {
    return null;
  }

  transformResponseBody(connection: Trace) {
    return connection.res?.body;
  }
}
