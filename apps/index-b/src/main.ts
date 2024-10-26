import { createIndexBService } from './createIndexBService';
import { createWsBroker } from '@product-backend/clients/wsBroker';

createIndexBService({
  broker: createWsBroker(),
});
