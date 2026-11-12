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

/**
 * Like Promise.allSettled, but runs at most `limit` tasks at a time.
 */
export async function settleWithLimit<T, R>(
  items: T[],
  limit: number,
  task: (item: T) => Promise<R>,
): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < items.length) {
      const idx = cursor++;
      try {
        results[idx] = { status: 'fulfilled', value: await task(items[idx]!) };
      } catch (reason) {
        results[idx] = { status: 'rejected', reason };
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
