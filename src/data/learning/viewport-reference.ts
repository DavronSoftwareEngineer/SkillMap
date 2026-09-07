// Teaching reference for a latest-request-wins loader; inject fetch at the adapter.
export function latestLoader<T>(
  fetchData: (query: string, signal: AbortSignal) => Promise<T>,
  publish: (state: { query: string; data?: T; error?: string; loading: boolean }) => void,
) {
  let revision = 0;
  let controller: AbortController | undefined;
  return {
    async load(query: string) {
      const current = ++revision;
      controller?.abort();
      controller = new AbortController();
      publish({ query, loading: true });
      try {
        const data = await fetchData(query, controller.signal);
        if (current === revision) publish({ query, data, loading: false });
      } catch (error) {
        if (current === revision) publish({ query, loading: false,
          error: error instanceof Error ? error.message : 'Request failed' });
      }
    },
    dispose() { ++revision; controller?.abort(); },
  };
}
// React: create once per effect/subscription lifetime; cleanup calls dispose().
// The injected fetch adapter must check response.ok and decode the payload.
// For map queries include bbox, zoom, filters and trusted access context.
