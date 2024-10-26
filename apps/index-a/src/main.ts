import { createIndexAService } from './createIndexAService';
import { createWsBroker } from '@product-backend/clients/wsBroker';

createIndexAService({
  broker: createWsBroker(),
});
