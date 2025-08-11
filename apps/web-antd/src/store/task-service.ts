import { ref } from 'vue';

import { defineStore } from 'pinia';

import { getTaskConfigParams } from '#/api/task-service';

interface Params {
  input?: Record<string, any>[];
  output?: Record<string, any>[];
}

interface ParamsWithSubMap {
  params?: Params;
  subMap?: Record<string, Params>;
}

export const useTaskServiceStore = defineStore('task-service', () => {
  const paramsMap = ref<Record<string, ParamsWithSubMap>>({});
  const loading = ref(false);

  async function getParams(
    taskType: string,
    subTaskId?: string,
  ): Promise<Params> {
    if (!taskType) {
      return {};
    }

    let params = subTaskId
      ? paramsMap.value[taskType]?.subMap?.[subTaskId]
      : paramsMap.value[taskType]?.params;

    if (!params) {
      loading.value = true;
      try {
        const data = await getTaskConfigParams(taskType, subTaskId);
        if (data) {
          params = data;
          if (!paramsMap.value[taskType]) {
            paramsMap.value[taskType] = {};
          }
          if (subTaskId) {
            if (!paramsMap.value[taskType].subMap) {
              paramsMap.value[taskType].subMap = {};
            }
            paramsMap.value[taskType].subMap[subTaskId] = data;
          } else {
            paramsMap.value[taskType].params = data;
          }
        }
      } finally {
        loading.value = false;
      }
    }

    return params || { input: [], output: [] };
  }

  return {
    loading,
    getParams,
  };
});
