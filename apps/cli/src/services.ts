import { createFsKv } from '@product-backend/clients/fsKv';
import { createMemDb } from '@product-backend/clients/memDb';
import { createWsBroker } from '@product-backend/clients/wsBroker';

export const services = {
  db: createMemDb(),
  kv: createFsKv(),
  broker: createWsBroker(),
};
