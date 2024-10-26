import { BrokerClient, EventAction, KvClient } from '@product-backend/types';

import { isPartialProductData } from './isPartialProductData';
import { mergeProductData } from './mergeProductData';

export async function createProductDataService(deps: {
  kv: KvClient;
  broker: BrokerClient;
}) {
  const kv = await deps.kv.connect({
    url: 'PDS',
  });

  const broker = await deps.broker.connect({
    url: 'ws://localhost:8080',
  });

  broker.subscribe(EventAction.Update, async (payload) => {
    console.info('[PDS] Update', payload.productData);

    const productKey = `PRODUCT_${payload.productData.id}`;

    const storedProductData = await kv.get(productKey);

    const existingProductData =
      storedProductData && JSON.parse(storedProductData);

    if (!existingProductData && isPartialProductData(payload.productData)) {
      return;
    }

    const fullProductData = mergeProductData(
      existingProductData,
      payload.productData
    );

    await kv.set(productKey, JSON.stringify(fullProductData));

    broker.emit({
      action: EventAction.Index,
      productData: fullProductData,
    });
  });
}
