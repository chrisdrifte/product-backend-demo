import { sleep } from '@product-backend/helpers';

export function createQueue<T>(options: {
  restore: () => Promise<T[]>;
  persist: (value: T[]) => Promise<void>;
  abort: VoidFunction;
  maxPerSecond?: number;
  retry?: number;
  retryDelay?: number;
}) {
  let items: T[] = [];

  let isDraining = false;

  const { retry = 3, retryDelay = 3000 } = options;
  let retryCount = 0;
  let drainAbortController: AbortController | undefined;

  function isEmpty() {
    return items.length === 0;
  }

  function push(item: T) {
    items.push(item);
  }

  async function abort() {
    options.abort();
    drainAbortController?.abort();
  }

  async function restore() {
    items = await options.restore();
  }

  async function persist() {
    await options.persist(items);
  }

  async function drain(fn: (item: T) => Promise<void> | void) {
    const startTime = performance.now();

    const totalItems = items.length;
    const { maxPerSecond = Infinity } = options;

    if (isDraining) {
      console.error(`[QUEUE] Already draining`);
      return;
    }

    isDraining = true;

    let item: T | undefined;

    while (items.length) {
      const retryItems: T[] = [];
      drainAbortController = new AbortController();

      while ((item = items.shift())) {
        try {
          // process
          await fn(item);
          await options.persist(items);
        } catch (err) {
          // cancel
          abort();

          // rollback
          await options.persist([...items, item]);

          // retry later
          retryItems.push(item);
          console.error(`[QUEUE] Error ${item} - ${err}`);
        }

        await sleep(1000 / maxPerSecond, {
          signal: drainAbortController.signal,
        });
      }

      if (retryItems.length) {
        console.error(`[QUEUE] ${retryItems.length} items failed`);
      }

      // all items processed successfully
      if (!retryItems.length) {
        break;
      }

      // no more retries allowed
      if (retryCount >= retry) {
        break;
      }

      console.info(`[QUEUE] ${retryItems.length} to retry in ${retryDelay}ms`);
      console.info(`[QUEUE] ${retry - retryCount} retries left`);

      await sleep(retryDelay, { signal: drainAbortController.signal });

      items = [...retryItems];
      retryCount++;
    }

    isDraining = false;

    const endTime = performance.now();
    const duration = endTime - startTime;

    console.info(`[QUEUE] Processed ${totalItems} items in ${~~duration}ms`);
  }

  process.once('SIGINT', cleanUpAndExit);
  process.once('SIGTERM', cleanUpAndExit);
  process.once('SIGQUIT', cleanUpAndExit);

  async function destroy() {
    abort();

    process.off('SIGINT', cleanUpAndExit);
    process.off('SIGTERM', cleanUpAndExit);
    process.off('SIGQUIT', cleanUpAndExit);

    items = [];

    await options.persist(items);
  }

  async function cleanUpAndExit() {
    abort();

    process.exit();
  }

  return {
    isEmpty,
    push,
    restore,
    persist,
    drain,
    destroy,
  };
}
