import { requestClient } from '#/api/request';

export namespace PermissionApi {
  export interface SysPermission {
    [key: string]: any;
    id?: number;
    pid?: number;
    permissionName: string;
    permissionKey: string;
    description?: string;
    enableFlag?: boolean;
  }
}

async function getPermissionTree() {
  return requestClient.get<Array<PermissionApi.SysPermission>>(
    '/system/permission',
  );
}

export { getPermissionTree };
