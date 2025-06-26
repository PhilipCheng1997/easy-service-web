import type { TaskApi } from '#/api';

import { requestClient } from '#/api/request';

const executeTask = async () => {
  return requestClient.post<TaskApi.TaskLog>('/task/execute', null, {
    timeout: 60_000,
  });
};

export { executeTask };
