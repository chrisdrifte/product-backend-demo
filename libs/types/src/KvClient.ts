import { KvClientConnection } from './KvClientConnection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KvClient<T = any> = {
  connect: (options: {
    signal?: AbortSignal;
  }) => Promise<KvClientConnection<T>>;
};
