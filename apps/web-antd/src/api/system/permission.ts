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

async function checkPermissionKeyUnique(
  permissionKey: string,
  permissionId?: number,
) {
  return requestClient.get<boolean>('/system/permission/check-key', {
    params: { permissionKey, permissionId },
  });
}

async function checkPermissionNameUnique(
  permissionName: string,
  permissionId?: number,
) {
  return requestClient.get<boolean>('/system/permission/check-name', {
    params: { permissionName, permissionId },
  });
}

async function addPermission(permission: PermissionApi.SysPermission) {
  return requestClient.post('/system/permission', permission);
}

async function updatePermission(permission: PermissionApi.SysPermission) {
  return requestClient.put('/system/permission', permission);
}

export {
  addPermission,
  checkPermissionKeyUnique,
  checkPermissionNameUnique,
  getPermissionTree,
  updatePermission,
};
