import { RequestRowData } from '@/components/RequestRowData';
import { System } from '@/systems';
import { ConnectionData } from '@/types';
import { pathAndQuery } from '@/utils';

const icon = new URL('Default.svg', import.meta.url);

export default class DefaultSystem implements System<null> {
  name = 'Default';

  isMatch() {
    return true;
  }

  getData(_: ConnectionData) {
    return null;
  }

  getIconPath(_?: ConnectionData) {
    return icon.pathname;
  }

  listComponent(connection: ConnectionData) {
    const [path, qs] = pathAndQuery(connection);
    return (
      <RequestRowData iconPath={this.getIconPath(connection)} hostName={connection.req.host} path={path} data={qs} />
    );
  }

  requestDetailComponent(_: ConnectionData) {
    return null;
  }

  transformRequestBody(connection: ConnectionData) {
    return connection.req?.body;
  }

  responseDetailComponent(_: ConnectionData) {
    return null;
  }

  transformResponseBody(connection: ConnectionData) {
    return connection.res?.body;
  }
}
