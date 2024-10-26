import {
  BrokerClientConnection,
  DbClientConnection,
  EventAction,
} from '@product-backend/types';

import { getProductDataById } from '../queries/getProductDataById';

export async function fullIndex(
  db: DbClientConnection,
  broker: BrokerClientConnection,
  productId: number
) {
  console.info('[FULL_INDEX]', productId);

  const fullProductData = await getProductDataById(db, productId);

  await broker.emit({
    action: EventAction.Update,
    productData: fullProductData,
  });
}
