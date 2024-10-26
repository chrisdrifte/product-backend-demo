import { BrokerClient, EventAction, KvClient } from '@product-backend/types';

import { isPartialProductData } from './isPartialProductData';
import { mergeProductData } from './mergeProductData';

export async function createProductDataService(deps: {
  kv: KvClient;
  broker: BrokerClient;
}) {
  const kv = await deps.kv.connect();

  const broker = await deps.broker.connect({
    url: 'ws://localhost:8080',
  });

  broker.subscribe(EventAction.Update, async (payload) => {
    console.info('[PDS] Update', payload.productData);

    const productKey = `PRODUCT_${payload.productData.id}`;

    const existingProductData = await kv.get(productKey);

    if (!existingProductData && isPartialProductData(payload.productData)) {
      return;
    }

    const fullProductData = mergeProductData(
      existingProductData,
      payload.productData
    );

    await kv.set(productKey, fullProductData);

    broker.emit({
      action: EventAction.Index,
      productData: fullProductData,
    });
  });
}
