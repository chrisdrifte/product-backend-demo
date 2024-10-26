export function createQueue<T>(deps: {
  restore: () => Promise<T[]>;
  persist: (value: T[]) => Promise<void>;
  abort: VoidFunction;
}) {
  let items: T[] = [];
  let isExecuting = false;

  function isEmpty() {
    return items.length === 0;
  }

  function push(item: T) {
    items.push(item);
  }

  async function restore() {
    items = await deps.restore();
  }

  async function persist() {
    await deps.persist(items);
  }

  async function execute(fn: (item: T) => Promise<void> | void) {
    if (isExecuting) {
      throw new Error('Can only execute the queue once');
    }

    isExecuting = true;

    let item: T | undefined;
    while ((item = items.shift())) {
      try {
        // process
        await fn(item);
        await persist();
      } catch (err) {
        // cancel
        deps.abort();

        // rollback
        push(item);
        await persist();

        // terminate
        throw err;
      }
    }
  }

  process.once('SIGINT', cleanUpAndExit);
  process.once('SIGTERM', cleanUpAndExit);
  process.once('SIGQUIT', cleanUpAndExit);

  async function destroy() {
    deps.abort();

    process.off('SIGINT', cleanUpAndExit);
    process.off('SIGTERM', cleanUpAndExit);
    process.off('SIGQUIT', cleanUpAndExit);

    items = [];
    await persist();
  }

  async function cleanUpAndExit() {
    deps.abort();

    process.exit();
  }

  return {
    isEmpty,
    push,
    restore,
    persist,
    execute,
    destroy,
  };
}
