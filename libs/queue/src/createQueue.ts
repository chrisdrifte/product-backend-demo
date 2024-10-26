import { sleep } from '@product-backend/helpers';

export function createQueue<T>(options: {
  restore?: () => Promise<Set<T>>;
  persist?: (value: Set<T>) => Promise<void>;
  abort?: VoidFunction;
  retry?: number;
  retryDelay?: number;
}) {
  let items = new Set<T>();

  let isDraining = false;

  const { retry = 3, retryDelay = 3000 } = options;

  let retryCount = 0;
  let retryAbortController: AbortController | undefined;

  function isEmpty() {
    return items.size === 0;
  }

  function push(item: T) {
    items.add(item);
  }

  async function abort() {
    options.abort?.();
    retryAbortController?.abort();
  }

  async function restore() {
    items = (await options.restore?.()) ?? new Set();
  }

  async function persist() {
    await options.persist?.(items);
  }

  async function drain(fn: (item: T) => Promise<void> | void) {
    const startTime = performance.now();
    const totalItems = items.size;

    if (isDraining) {
      console.error(`[QUEUE] Already draining`);
      return;
    }

    isDraining = true;

    while (items.size) {
      const retryItems: T[] = [];

      for (const item of items) {
        try {
          await fn(item);
        } catch (err) {
          // retry later
          retryItems.push(item);
          console.error(`[QUEUE] Error ${item} - ${err}`);
        }
      }

      if (retryItems.length) {
        console.error(`[QUEUE] ${retryItems.length} items failed`);
      }

      items = new Set(retryItems);
      await options.persist?.(items);

      // all items processed successfully
      if (!items.size) {
        break;
      }

      // no more retries allowed
      if (retryCount >= retry) {
        await abort();
        throw new Error('[QUEUE] Failed to process all items');
      }

      console.info(`[QUEUE] ${items.size} to retry in ${retryDelay}ms`);
      console.info(`[QUEUE] ${retry - retryCount} retries left`);

      retryAbortController = new AbortController();
      await sleep(retryDelay, { signal: retryAbortController.signal });

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

    items = new Set();

    await options.persist?.(items);
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
