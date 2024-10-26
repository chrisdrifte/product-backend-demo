export type DbClientConnection<T> = {
  query: (query: string) => Promise<T | undefined>;
  destroy: () => Promise<void>;
};
