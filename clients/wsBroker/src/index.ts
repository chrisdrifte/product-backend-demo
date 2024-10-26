import {
  BrokerClient,
  BrokerClientConnection,
  IndexEvent,
  UpdateEvent,
} from '@product-backend/types';

import WebSocket from 'ws';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Data = any;

const wsBroker: BrokerClient<Data> = {
  async connect({ url, signal }) {
    const ws = new WebSocket(url, { signal });

    ws.on('open', () => {
      console.info('Connected to broker');
    });

    ws.on('close', () => {
      console.info('Disconnected from broker');
    });

    ws.on('error', (error) => {
      console.error('Broker error:', error);
    });

    return new Promise<BrokerClientConnection<Data>>((resolve, reject) => {
      ws.on('open', () => {
        const connection = {
          emit(payload: unknown) {
            return new Promise<void>((resolve, reject) =>
              ws.send(JSON.stringify({ payload }), (err) => {
                if (err) {
                  console.error(err);
                  reject();
                  return;
                }

                resolve();
              })
            );
          },

          async subscribe(
            action: string,
            fn: (event: UpdateEvent | IndexEvent) => void
          ) {
            ws.on('message', (message) => {
              const parsedMessage = JSON.parse(message.toString());

              if (parsedMessage.payload.action !== action) {
                return;
              }

              fn(parsedMessage.payload);
            });
          },

          async destroy() {
            ws.close();
          },
        };

        resolve(connection);
      });

      ws.on('error', reject);
    });
  },
};

export function createWsBroker() {
  return wsBroker;
}
