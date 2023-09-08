import { System } from '@/systems';
import { RequestRowData } from '@/components/RequestRowData';
import { ConnectionData } from '@/types';
import { pathAndQuery } from '@/utils';

export default class DefaultSystem implements System<null> {
  name = 'Default';

  static ICON_PATH = '/images/systems/default.svg';

  isMatch() {
    return true;
  }

  getData(_: ConnectionData) {
    return null;
  }

  getIconPath(_?: ConnectionData) {
    return DefaultSystem.ICON_PATH;
  }

  listComponent(connection: ConnectionData) {
    const [path, qs] = pathAndQuery(connection);
    return (
      <RequestRowData
        iconPath={this.getIconPath(connection)}
        hostName={connection.req.host}
        path={path}
        data={qs}
      />
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
