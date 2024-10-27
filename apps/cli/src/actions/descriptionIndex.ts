import {
  BrokerClientConnection,
  DbClientConnection,
  EventAction,
} from '@product-backend/types';

import { getProductDescriptionById } from '../queries/getProductDescriptionById';

export async function descriptionIndex(
  db: DbClientConnection,
  broker: BrokerClientConnection,
  productId: number
) {
  const partialProductData = await getProductDescriptionById(db, productId);

  await broker.emit({
    action: EventAction.Update,
    productData: partialProductData,
    tags: ['description'],
  });
}
