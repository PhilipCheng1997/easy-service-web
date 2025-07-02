<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getPermissionTree } from '#/api/system';

import Form from './component/form.vue';
import { useColumns } from './data';

const [Grid] = useVbenVxeGrid({
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
</script>

<template>
  <Page auto-content-height>
    <Modal />
    <Grid>
      <template #toolbar-tools>
        <Button type="primary" @click="handleAdd">添加权限</Button>
      </template>
    </Grid>
  </Page>
</template>

<style scoped></style>
