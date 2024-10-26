import { BrokerClient, EventAction } from '@product-backend/types';

export async function createProductDataService(deps: { broker: BrokerClient }) {
  const broker = await deps.broker.connect({
    url: 'ws://localhost:8080',
  });

  broker.subscribe(EventAction.Update, (payload) => {
    console.info('[PDS] Update', payload.productData);

    broker.emit({
      action: EventAction.Index,
      productData: payload.productData,
    });
  });
}
