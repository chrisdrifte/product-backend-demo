export function sleep(delay: number) {
  if (!delay) {
    return;
  }

  return new Promise<void>((resolve) => {
    setTimeout(resolve, delay);
  });
}
