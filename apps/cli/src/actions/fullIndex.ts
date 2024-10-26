import {
  BrokerClient,
  DbClient,
  EventAction,
  KvClient,
  ProductData,
  UpdateEvent,
} from '@product-backend/types';

import { createQueue } from '@product-backend/queue';
import { getProductDataById } from '../queries/getProductDataById';
import { getProductIds } from '../queries/getProductIds';

/**
 * Initiates a full index
 */
export async function fullIndex(deps: {
  db: DbClient;
  kv: KvClient;
  broker: BrokerClient<UpdateEvent>;
}) {
  // maximize our chances of atomic operations by aborting all actions if we
  // encounter an error

  const abortController = new AbortController();
  const signal = abortController.signal;
  const abort = abortController.abort.bind(abortController);

  // external services

  const db = await deps.db.connect({ signal });

  const kv = await deps.kv.connect({ signal });

  const broker = await deps.broker.connect({
    url: 'ws://localhost:8080',
    signal,
  });

  // internal service factories

  function createProductIdQueue() {
    type ProductId = ProductData['id'];

    const queueKey = 'PRODUCT_ID_QUEUE';

    const restoreQueue = async () => {
      const queueValue = await kv.get(queueKey);
      return JSON.parse(queueValue ?? '[]');
    };

    const persistQueue = async (productIds: ProductId[]) => {
      if (!productIds.length) {
        await kv.delete(queueKey);
        return;
      }

      const queueValue = JSON.stringify(productIds);
      await kv.set(queueKey, queueValue);
    };

    return createQueue<ProductId>({
      restore: restoreQueue,
      persist: persistQueue,
      abort,
    });
  }

  // we wish to iterate over many thousands of products
  // iterating over these products in a queue allows us to do things like recover
  // from error states (eg. with retry logic) or avoid flooding the network (eg.
  // with chunking/rate limiting)
  const productIdQueue = createProductIdQueue();

  // did our script crash half way through processing a queue?
  await productIdQueue.restore();

  // if not, build a new queue
  if (productIdQueue.isEmpty()) {
    const productIds = await getProductIds(db);

    for (const productId of productIds) {
      productIdQueue.push(productId);
    }

    await productIdQueue.persist();
  }

  // emit every product to the broker
  await productIdQueue.execute(async (productId) => {
    const productData = await getProductDataById(db, productId);

    await broker.emit({
      action: EventAction.Update,
      productData,
    });
  });

  // clean up
  await productIdQueue.destroy();
  await broker.destroy();
}
