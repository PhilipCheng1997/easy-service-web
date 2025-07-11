<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PermissionApi } from '#/api/system';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPermissionTree } from '#/api/system';

import Form from './component/form.vue';
import { useColumns } from './data';

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useColumns(),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async (_params) => {
          return await getPermissionTree();
        },
      },
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
    },
    treeConfig: {
      parentField: 'pid',
      rowField: 'id',
      transform: false,
    },
  } as VxeTableGridOptions,
});

const [Modal, modalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

function handleAdd() {
  modalApi.open();
}

function handleEdit(row: PermissionApi.SysPermission) {
  modalApi.setData(row).open();
}

function handleModalConfirm() {
  gridApi.reload();
}
</script>

<template>
  <Page auto-content-height>
    <Modal @success="handleModalConfirm" />
    <Grid>
      <template #toolbar-tools>
        <Button type="primary" @click="handleAdd" size="small">添加权限</Button>
      </template>
      <template #op="{ row }">
        <Button type="link" size="small" @click="handleEdit(row)">编辑</Button>
        <Button type="link" size="small" :danger="true">删除</Button>
      </template>
    </Grid>
  </Page>
</template>

<style scoped></style>
