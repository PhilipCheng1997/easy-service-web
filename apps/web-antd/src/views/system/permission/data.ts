import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';
import type { PermissionApi } from '#/api/system';

import { z } from '#/adapter/form';
import {
  checkPermissionKeyUnique,
  checkPermissionNameUnique,
  getPermissionTree,
} from '#/api/system';

export function useColumns(): VxeGridPropTypes.Columns<PermissionApi.SysPermission> {
  return [
    {
      align: 'left',
      fixed: 'left',
      treeNode: true,
      field: 'permissionKey',
      title: '权限标识',
    },
    {
      field: 'permissionName',
      title: '权限名称',
    },
    {
      cellRender: { name: 'CellSwitch' },
      field: 'enableFlag',
      title: '启用状态',
    },
    {
      field: 'description',
      title: '描述',
    },
    {
      field: 'op',
      title: '操作',
      slots: { default: 'op' },
    },
  ];
}

export function useSchema(id?: number): VbenFormSchema[] {
  return [
    {
      component: 'ApiTreeSelect',
      fieldName: 'pid',
      label: '父级权限',
      componentProps: {
        api: getPermissionTree,
        allowClear: true,
        treeDefaultExpandAll: true,
        valueField: 'id',
        childrenField: 'children',
        labelField: 'permissionName',
        placeholder: '请选择父级权限',
        class: 'w-full',
      },
    },
    {
      component: 'Input',
      fieldName: 'permissionKey',
      label: '权限标识',
      componentProps: {
        placeholder: '请输入权限标识',
      },
      rules: z
        .string()
        .min(1, '请输入权限标识')
        .refine(async (v) => {
          return v ? await checkPermissionKeyUnique(v, id) : true;
        }, '权限标识已存在'),
    },
    {
      component: 'Input',
      fieldName: 'permissionName',
      label: '权限名称',
      componentProps: {
        placeholder: '请输入权限名称',
      },
      rules: z
        .string()
        .min(1, '请输入权限名称')
        .refine(async (v) => {
          return v ? await checkPermissionNameUnique(v, id) : true;
        }, '权限名称已存在'),
    },
    {
      component: 'Switch',
      fieldName: 'enableFlag',
      label: '启用状态',
      componentProps: {
        options: [
          { value: true, label: '启用' },
          { value: false, label: '禁用' },
        ],
      },
    },
    {
      component: 'Textarea',
      fieldName: 'description',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
      },
    },
  ];
}
