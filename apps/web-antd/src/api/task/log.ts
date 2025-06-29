import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace TaskApi {
  export interface TaskLog {
    [key: string]: any;
    delayExecute?: number;
    delayMinutes?: number;
    endTime?: string;
    error?: string;
    executableTime?: string;
    executeTime?: string;
    id: number;
    isExecuted?: boolean;
    isSuccess?: boolean;
    output?: string;
    scriptOutput?: string;
    startTime?: string;
    isNotified?: number;
  }
}

async function queryTaskLog(params: Recordable<any>) {
  return requestClient.get<Array<TaskApi.TaskLog>>('/task/log', { params });
}

export { queryTaskLog };
