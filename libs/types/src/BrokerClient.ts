import { BrokerClientConnection } from './BrokerClientConnection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BrokerClient<T = any> = {
  connect: (options: { url: string }) => Promise<BrokerClientConnection<T>>;
};
