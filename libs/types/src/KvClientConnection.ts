export type KvClientConnection<T> = {
  set: (key: string, value: T) => Promise<void>;
  get: (key: string) => Promise<T>;
  delete: (key: string) => Promise<void>;
  destroy: () => Promise<void>;
};
