import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

async function listCalendarData(params: Recordable<any>) {
  return requestClient.get('/calendar', { params });
}

export { listCalendarData };
