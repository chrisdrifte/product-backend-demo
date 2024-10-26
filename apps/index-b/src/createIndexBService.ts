import { BrokerClient, EventAction } from '@product-backend/types';

import { updateIndexB } from '@product-backend/clients/indexB';

const BROKER_URL = 'ws://localhost:8080';

export async function createIndexBService(deps: { broker: BrokerClient }) {
  const broker = await deps.broker.connect({
    url: BROKER_URL,
  });

  broker.subscribe(EventAction.Index, (payload) => {
    updateIndexB(payload.productData);
  });
}
