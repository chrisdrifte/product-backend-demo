import {
  BrokerClientConnection,
  DbClientConnection,
  EventAction,
} from '@product-backend/types';

import { getProductPriceById } from '../queries/getProductPriceById';

export async function priceIndex(
  db: DbClientConnection,
  broker: BrokerClientConnection,
  productId: number
) {
  console.info('[PRICE_INDEX]', productId);

  const partialProductData = await getProductPriceById(db, productId);

  await broker.emit({
    action: EventAction.Update,
    productData: partialProductData,
  });
}
