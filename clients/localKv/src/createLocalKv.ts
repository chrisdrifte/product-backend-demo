import { KvClient, KvClientConnection } from '@product-backend/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Value = any;

// @todo replace with filesystem
const storage: Map<string, Value> = new Map();

const connection: KvClientConnection<Value> = {
  async set(key: string, value: Value) {
    storage.set(key, value);
  },

  async get(key: string) {
    storage.get(key);
  },

  async delete(key: string) {
    storage.delete(key);
  },

  async destroy() {
    storage.clear();
  },
};

const localKv: KvClient<Value> = {
  async connect() {
    return connection;
  },
};

export function createLocalKv() {
  return localKv;
}
