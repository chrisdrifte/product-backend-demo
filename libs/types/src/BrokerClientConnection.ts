export type BrokerClientConnection<T> = {
  emit: (event: T) => Promise<void>;
  subscribe: (fn: (data: T) => void) => Promise<void>;
  destroy: () => Promise<void>;
};
