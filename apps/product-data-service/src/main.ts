import { createProductDataService } from './createProductDataService';
import { createWsBroker } from '@product-backend/clients/wsBroker';

createProductDataService({
  broker: createWsBroker(),
});
