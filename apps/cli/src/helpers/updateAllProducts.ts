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
  const startTime = performance.now();

  // maximize our chances of atomic operations by aborting all actions if we
  // encounter an error

  const abortController = new AbortController();
  const signal = abortController.signal;
  const abort = abortController.abort.bind(abortController);

  // external services

  const db = await deps.db.connect({ signal });

  const kv = await deps.kv.connect({ url: 'CLI', signal });

  const broker = await deps.broker.connect({
    url: 'ws://localhost:8080',
    signal,
  });

  // internal service factories

  function createProductIdQueue() {
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
  let count = 0;

  await productIdQueue.execute(async (productId) => {
    await processProductId(db, broker, productId);
    count++;
  });

  // clean up
  await db.destroy();
  await kv.destroy();
  await broker.destroy();
  await productIdQueue.destroy();

  const endTime = performance.now();
  const duration = endTime - startTime;

  console.info(`[CLI] Processed ${count} products in ${~~duration}ms`);

  const predictCount = 300_000;
  console.info(
    `[CLI] ${predictCount} products would take around ${~~(
      ((predictCount / count) * duration) /
      1000 /
      60
    )}m`
  );
}
