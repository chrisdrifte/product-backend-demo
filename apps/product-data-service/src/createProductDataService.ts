import { BrokerClient } from '@product-backend/types';

export async function createProductDataService(deps: { broker: BrokerClient }) {
  const broker = await deps.broker.connect({
    url: 'ws://localhost:8080',
  });

  broker.subscribe((data) => {
    console.info('[PDS]', data.action, data.productData);
  });
}
