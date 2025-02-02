import {
  BrokerClient,
  BrokerClientConnection,
  DbClient,
  DbClientConnection,
  KvClient,
  ProductData,
  UpdateEvent,
} from '@product-backend/types';

import { createQueue } from '@product-backend/queue';
import { getProductIds } from '../queries/getProductIds';

type ProductId = ProductData['id'];

export async function updateAllProducts(
  /**
   * Used to restore and persist the product id queue
   */
  queueKey: string,
  /**
   * Inject the logic for fetching the data and emitting the update event
   */
  processProductId: (
    db: DbClientConnection,
    broker: BrokerClientConnection,
    productId: ProductId
  ) => Promise<void>,
  /**
   * Inject external services
   */
  deps: {
    /**
     * The database that contains the relational product data
     */
    db: DbClient;
    /**
     * A key/value store used for persisting data in case the script crashes
     */
    kv: KvClient;
    /**
     * The message broker (eg. pubsub)
     */
    broker: BrokerClient<UpdateEvent>;
  }
) {
  // external services

  const db = await deps.db.connect();

  const kv = await deps.kv.connect({ url: 'CLI' });

  const broker = await deps.broker.connect({
    url: 'ws://localhost:8080',
  });

  // internal service factories

  function createProductIdQueue() {
    const restoreQueue = async () => {
      const queueValue = await kv.get(queueKey);
      return new Set(JSON.parse(queueValue ?? '[]') as number[]);
    };

    const persistQueue = async (productIds: Set<ProductId>) => {
      if (!productIds.size) {
        await kv.delete(queueKey);
        return;
      }

      const queueValue = JSON.stringify(Array.from(productIds));
      await kv.set(queueKey, queueValue);
    };

    return createQueue<ProductId>({
      restore: restoreQueue,
      persist: persistQueue,
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
  }

  await productIdQueue.persist();

  // emit every product to the broker
  await productIdQueue.drain(async (productId) => {
    await processProductId(db, broker, productId);
  });

  // clean up
  await db.destroy();
  await kv.destroy();
  await broker.destroy();
  await productIdQueue.destroy();
}
