import { DEFAULT_WEB_SOCKET_PORT } from '@envyjs/core';
import { Server } from 'mock-socket';

import { Trace } from '@/types';

import CollectorClient from './CollectorClient';

describe('CollectorClient', () => {
  let port: number;
  let mockServer: Server;

  function mockTrace(req: Partial<Trace['http']>): Trace {
    return {
      id: '1',
      parentId: undefined,
      timestamp: 0,
      http: {
        httpVersion: '1.1',
        method: 'GET',
        host: 'www.example.com',
        port: 443,
        path: '/',
        url: 'https://www.example.com/',
        requestHeaders: {},
        requestBody: undefined,
        ...req,
      },
    };
  }

  beforeEach(() => {
    port = 1234;
    mockServer = new Server(`ws://127.0.0.1:${port}/viewer`);
  });

  afterEach(() => {
    mockServer.stop();
  });

  it('should set default port if not defined', () => {
    const client = new CollectorClient({});

    expect(client.port).toEqual(DEFAULT_WEB_SOCKET_PORT);
  });

  it('should set port from constructor arguments', () => {
    const port = 1234;
    const client = new CollectorClient({ port });

    expect(client.port).toEqual(port);
  });

  it('should initially be in the "connecting" state', () => {
    const client = new CollectorClient({ port: 1234 });

    expect(client.connecting).toEqual(true);
    expect(client.connected).toEqual(false);
  });

  it('should initially have an empty collection of traces', () => {
    const client = new CollectorClient({ port: 1234 });

    expect(client.traces.size).toEqual(0);
  });

  describe('start', () => {
    it('should connect to the collector Web Socket server', done => {
      const client = new CollectorClient({ port });

      mockServer.on('connection', () => {
        done();
      });

      client.start();
    });

    it('should set the "connected" state', done => {
      const client = new CollectorClient({ port });

      mockServer.on('connection', () => {
        expect(client.connecting).toEqual(false);
        expect(client.connected).toEqual(true);
        done();
      });

      client.start();
    });

    it('should add incoming messages to the traces', done => {
      const client = new CollectorClient({ port });
      const trace = mockTrace({});

      mockServer.on('connection', socket => {
        socket.addEventListener('message', () => {
          expect(client.traces.size).toEqual(1);
          expect(client.traces.get(trace.id)).toEqual(trace);
          done();
        });

        mockServer.emit('message', JSON.stringify(trace));
      });

      client.start();
    });

    it('should fire changeHandler when new traces come in', done => {
      const changeHandler = jest.fn();
      const client = new CollectorClient({ port, changeHandler });

      mockServer.on('connection', socket => {
        socket.addEventListener('message', async () => {
          await new Promise(process.nextTick);

          expect(changeHandler).toHaveBeenCalledWith('1');
          done();
        });

        const trace = mockTrace({});
        mockServer.emit('message', JSON.stringify(trace));
      });

      client.start();
    });

    it('should not include `newTraceId` in changeHandler if trace already exists', done => {
      const changeHandler = jest.fn();
      const client = new CollectorClient({ port, changeHandler });

      mockServer.on('connection', socket => {
        socket.addEventListener('message', async () => {
          await new Promise(process.nextTick);

          expect(changeHandler).toHaveBeenCalledWith(undefined);
          done();
        });

        const trace = mockTrace({});
        // @ts-expect-error
        client._traces.set(trace.id, trace);

        mockServer.emit('message', JSON.stringify(trace));
      });

      client.start();
    });
  });

  describe('clearTraces', () => {
    const trace = mockTrace({});

    it('should empty the traces collection', () => {
      const client = new CollectorClient({ port: 1234 });
      client.addEvent(trace);
      expect(client.traces.size).toEqual(1);

      client.clearTraces();
      expect(client.traces.size).toEqual(0);
    });
  });
});
