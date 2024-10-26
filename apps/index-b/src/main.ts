import { BrokerClient } from '@product-backend/types';
import { createWsBroker } from '@product-backend/clients/wsBroker';

createIndexBService({
  broker: createWsBroker(),
});

async function createIndexBService(deps: { broker: BrokerClient }) {
  const broker = await deps.broker.connect({
    url: 'ws://localhost:8080',
  });

  broker.subscribe((data) => {
    console.info('[Index B]', data);
  });
}
