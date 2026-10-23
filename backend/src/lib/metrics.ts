/**
 * Minimal in-process counters rendered in Prometheus text format.
 * No dependency: counters live in this process and reset on restart. The /metrics endpoint is
 * served only on the backend's internal port (nginx does not route to it), so it is not public.
 */

type Labels = Record<string, string>;

const counters = new Map<string, number>();
const startedAt = Date.now();

function seriesKey(name: string, labels?: Labels): string {
  if (!labels || Object.keys(labels).length === 0) return name;
  const body = Object.keys(labels)
    .sort()
    .map((k) => `${k}="${labels[k]!.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`)
    .join(',');
  return `${name}{${body}}`;
}

export function incCounter(name: string, labels?: Labels, by = 1): void {
  const key = seriesKey(name, labels);
  counters.set(key, (counters.get(key) ?? 0) + by);
}

export function renderMetrics(): string {
  const lines: string[] = [];
  for (const [key, value] of counters) lines.push(`${key} ${value}`);
  lines.push(`process_uptime_seconds ${Math.floor((Date.now() - startedAt) / 1000)}`);
  lines.push(`process_heap_used_bytes ${process.memoryUsage().heapUsed}`);
  return `${lines.join('\n')}\n`;
}
