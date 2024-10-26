import { createLocalKv } from '@product-backend/clients/localKv';
import { createProductDataService } from './createProductDataService';
import { createWsBroker } from '@product-backend/clients/wsBroker';

createProductDataService({
  kv: createLocalKv(),
  broker: createWsBroker(),
});
