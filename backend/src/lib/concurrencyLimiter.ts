/**
 * Returns a function that runs async tasks with at most `limit` executing at once.
 * Extra calls wait in FIFO order. Used to cap concurrent outbound API calls.
 */
export function createConcurrencyLimiter(limit: number): <T>(task: () => Promise<T>) => Promise<T> {
  let active = 0;
  const waiting: Array<() => void> = [];

  function releaseNext(): void {
    if (active < limit && waiting.length > 0) {
      active++;
      waiting.shift()!();
    }
  }

  return async function run<T>(task: () => Promise<T>): Promise<T> {
    await new Promise<void>((resolve) => {
      waiting.push(resolve);
      releaseNext();
    });
    try {
      return await task();
    } finally {
      active--;
      releaseNext();
    }
  };
}
