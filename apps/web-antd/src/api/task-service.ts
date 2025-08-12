import { requestClient } from '#/api/request';

async function getTaskConfigs() {
  return requestClient.get('/task-service/configs');
}

async function getTaskConfigParams(taskType, subTaskId) {
  return requestClient.get('/task-service/configs/params', {
    params: { taskType, subTaskId },
  });
}

async function executeTasks(tasks) {
  return requestClient.post('/task-service/execute', tasks);
}

export { executeTasks, getTaskConfigParams, getTaskConfigs };
