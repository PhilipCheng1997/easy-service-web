import type { Recordable } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace ServiceInfoApi {
  export interface ServiceInfo {
    serviceName: string;
    lastHeartbeat: string;
    env?: string;
    port: number;
    createTime: string;
    isOnline: boolean;
    onlineTime?: string;
    offlineTime?: string;
    isCurrentService?: boolean;
  }
}

async function queryServiceInfo(params: Recordable<any>) {
  return requestClient.get<ServiceInfoApi.ServiceInfo>('/service/query', {
    params,
  });
}

async function closeService(serviceName: string) {
  return requestClient.post(`/service/close?serviceName=${serviceName}`);
}

export { closeService, queryServiceInfo };
