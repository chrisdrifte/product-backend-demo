export type DbClientConnection<T = unknown> = {
  query: (query: string) => Promise<T | undefined>;
  destroy: () => Promise<void>;
};
