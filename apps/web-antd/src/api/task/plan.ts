import type { Recordable } from '@vben-core/typings';

import { requestClient } from '#/api/request';

async function getTaskPlan() {
  return requestClient.get<Recordable<any>>('/task/plan');
}

export { getTaskPlan };
