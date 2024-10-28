import { BrokerClient, EventAction, ProductData } from '@product-backend/types';

import { isPartialProductData } from './helpers/isPartialProductData';
import { mergeProductData } from './helpers/mergeProductData';
import { readProductData } from './helpers/readProductData';
import { writeProductData } from './helpers/writeProductData';

export async function createProductDataService(deps: { broker: BrokerClient }) {
  const broker = await deps.broker.connect({
    url: 'ws://localhost:8080',
  });

  broker.subscribe(EventAction.Update, async (payload) => {
    console.info('[PDS] Update', payload.productData);

    const isPartial = isPartialProductData(payload.productData);

    if (!isPartial) {
      const fullProductData = payload.productData;
      await updateAndEmit(fullProductData, ['*']);

      return;
    }

    const prevProductData = await readProductData(payload.productData.id);

    if (prevProductData) {
      const fullProductData = mergeProductData(
        prevProductData,
        payload.productData
      );

      await updateAndEmit(fullProductData, payload.tags);
    }
  });

  const updateAndEmit = async (productData: ProductData, tags: string[]) => {
    await writeProductData(productData);

    broker.emit({
      action: EventAction.Index,
      productData: productData,
      tags,
    });
  };
}
