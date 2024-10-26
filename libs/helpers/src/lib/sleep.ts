export function sleep(delay: number, options: { signal?: AbortSignal } = {}) {
  if (!delay) {
    return;
  }

  if (options.signal?.aborted) {
    return;
  }

  return new Promise<void>((resolve, reject) => {
    const wake = () => {
      options.signal?.removeEventListener('abort', abort);
      resolve();
    };

    const abort = () => {
      clearTimeout(id);
      reject();
    };

    const id = setTimeout(wake, delay);

    options.signal?.addEventListener('abort', abort);
  });
}
