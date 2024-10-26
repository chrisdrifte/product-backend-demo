import { BrokerClient, EventAction, ProductData } from '@product-backend/types';

import { isPartialProductData } from './isPartialProductData';
import { mergeProductData } from './mergeProductData';
import { readProductData } from './readProductData';
import { writeProductData } from './writeProductData';

export async function createProductDataService(deps: { broker: BrokerClient }) {
  const broker = await deps.broker.connect({
    url: 'ws://localhost:8080',
  });

  broker.subscribe(EventAction.Update, async (payload) => {
    console.info('[PDS] Update', payload.productData);

    const isPartial = isPartialProductData(payload.productData);

    if (!isPartial) {
      const fullProductData = payload.productData;
      await updateAndEmit(fullProductData);

      return;
    }

    const prevProductData = await readProductData(payload.productData.id);

    if (prevProductData) {
      const fullProductData = mergeProductData(
        prevProductData,
        payload.productData
      );

      await updateAndEmit(fullProductData);
    }
  });

  const updateAndEmit = async (productData: ProductData) => {
    await writeProductData(productData);

    broker.emit({
      action: EventAction.Index,
      productData: productData,
    });
  };
}
