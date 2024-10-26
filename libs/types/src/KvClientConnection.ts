export type KvClientConnection<T = string> = {
  set: (key: string, value: T) => Promise<void>;
  get: (key: string) => Promise<T | undefined>;
  delete: (key: string) => Promise<void>;
  destroy: () => Promise<void>;
};
