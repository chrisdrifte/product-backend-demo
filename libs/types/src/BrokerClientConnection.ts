import { EventAction } from './EventAction';

export type BrokerClientConnection<T> = {
  emit: (event: T) => Promise<void>;
  subscribe: (action: EventAction, fn: (data: T) => void) => Promise<void>;
  destroy: () => Promise<void>;
};
