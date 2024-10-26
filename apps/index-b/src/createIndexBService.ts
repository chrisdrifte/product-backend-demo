import { BrokerClient } from '@product-backend/types';

const BROKER_URL = 'ws://localhost:8080';

export async function createIndexBService(deps: { broker: BrokerClient }) {
  const broker = await deps.broker.connect({
    url: BROKER_URL,
  });

  broker.subscribe((data) => {
    console.info('[Index B]', data);
  });
}
