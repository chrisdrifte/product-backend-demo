import { BrokerClient, EventAction } from '@product-backend/types';

import { updateIndexA } from '@product-backend/clients/indexA';

const BROKER_URL = 'ws://localhost:8080';

export async function createIndexAService(deps: { broker: BrokerClient }) {
  const broker = await deps.broker.connect({
    url: BROKER_URL,
  });

  broker.subscribe(EventAction.Index, (payload) => {
    updateIndexA(payload.productData);
  });
}
