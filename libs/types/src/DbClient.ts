import { DbClientConnection } from './DbClientConnection';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DbClient<T = any> = {
  connect: (options?: {
    signal?: AbortSignal;
  }) => Promise<DbClientConnection<T>>;
};
