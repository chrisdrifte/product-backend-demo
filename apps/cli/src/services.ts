import { createLocalKv } from '@product-backend/clients/localKv';
import { createMemDb } from '@product-backend/clients/memDb';
import { createWsBroker } from '@product-backend/clients/wsBroker';

export const services = {
  db: createMemDb(),
  kv: createLocalKv(),
  broker: createWsBroker(),
};
