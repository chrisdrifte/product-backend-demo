import { BrokerClient, EventAction, ProductData } from '@product-backend/types';

import { bulkUpdateIndexB } from './helpers/bulkUpdateIndexB';

const BROKER_URL = 'ws://localhost:8080';

export async function createIndexBService(deps: { broker: BrokerClient }) {
  const broker = await deps.broker.connect({
    url: BROKER_URL,
  });

  let bulkProductData: ProductData[] = [];
  let throttleTimeout: ReturnType<typeof setTimeout> | undefined;

  function executeBulkUpdate() {
    bulkUpdateIndexB(bulkProductData);
    bulkProductData = [];
  }

  broker.subscribe(EventAction.Index, (payload) => {
    const acceptTags = ['*', 'name', 'price'];

    if (!payload.tags.some((tag) => acceptTags.includes(tag))) {
      return;
    }

    const productData = payload.productData as ProductData;
    bulkProductData.push(productData);

    if (bulkProductData.length >= 2) {
      executeBulkUpdate();
      return;
    }

    clearTimeout(throttleTimeout);
    throttleTimeout = setTimeout(executeBulkUpdate, 10 * 1000);
  });
}
