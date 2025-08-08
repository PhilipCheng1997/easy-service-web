import { requestClient } from '#/api/request';

async function getTaskConfigs() {
  return requestClient.get('/task-service/configs');
}

async function getTaskConfigParams(taskType, subTaskId) {
  return requestClient.get('/task-service/configs/params', {
    params: { taskType, subTaskId },
  });
}

export { getTaskConfigParams, getTaskConfigs };
