import { KvClientConnection } from './KvClientConnection';

export type KvClient<T = string> = {
  connect: (options: { url: string }) => Promise<KvClientConnection<T>>;
};
