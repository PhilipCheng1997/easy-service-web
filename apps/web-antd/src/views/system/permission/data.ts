import type { VxeGridPropTypes } from '#/adapter/vxe-table';
import type { PermissionApi } from '#/api/system';

function useColumns(): VxeGridPropTypes.Columns<PermissionApi.SysPermission> {
  return [
    {
      field: 'permissionKey',
      title: '权限标识',
    },
    {
      field: 'permissionName',
      title: '权限名称',
    },
    {
      field: 'description',
      title: '描述',
    },
    {
      field: 'enableFlag',
      title: '启用状态',
    },
    {
      field: 'op',
      title: '操作',
    },
  ];
}

export { useColumns };
