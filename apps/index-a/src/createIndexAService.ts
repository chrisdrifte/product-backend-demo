import { BrokerClient, EventAction } from '@product-backend/types';

import { updateIndexA } from './helpers/updateIndexA';

const BROKER_URL = 'ws://localhost:8080';

export async function createIndexAService(deps: { broker: BrokerClient }) {
  const broker = await deps.broker.connect({
    url: BROKER_URL,
  });

  broker.subscribe(EventAction.Index, (payload) => {
    const acceptTags = ['*', 'name', 'description'];

    if (!payload.tags.some((tag) => acceptTags.includes(tag))) {
      return;
    }

    updateIndexA(payload.productData);
  });
}
