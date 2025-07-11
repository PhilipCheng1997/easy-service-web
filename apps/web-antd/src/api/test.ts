import { requestClient } from '#/api/request';

async function startEvents(hasError?: boolean) {
  return requestClient.get('/test/sse/start', { params: { hasError } });
}

export { startEvents };
