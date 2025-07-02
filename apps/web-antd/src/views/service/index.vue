<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { queryServiceInfo } from '#/api/service';

const [Grid] = useVbenVxeGrid({
  gridOptions: {
    columns: [
      {
        slots: {
          default: 'serviceName',
        },
        field: 'serviceName',
        title: '服务标识',
        minWidth: 250,
      },
      {
        cellRender: {
          name: 'CellTag',
          options: [
            { value: true, label: '上线', color: 'success' },
            { value: false, label: '下线' },
          ],
        },
        field: 'isOnline',
        title: '服务状态',
        minWidth: 80,
      },
      {
        cellRender: { name: 'CellTag' },
        field: 'env',
        title: '环境',
        minWidth: 80,
      },
      {
        cellRender: { name: 'CellTag' },
        field: 'port',
        title: '端口',
        minWidth: 80,
      },
      {
        field: 'createTime',
        title: '创建时间',
        minWidth: 150,
      },
      {
        field: 'lastHeartbeat',
        title: '最后一次心跳时间',
        minWidth: 150,
      },
      {
        field: 'onlineTime',
        title: '上线时间',
        minWidth: 150,
      },
      {
        field: 'offlineTime',
        title: '下线时间',
        minWidth: 150,
      },
      {
        align: 'right',
        field: 'operation',
        slots: {
          default: 'operation',
        },
        fixed: 'right',
        headerAlign: 'center',
        showOverflow: false,
        title: '操作',
        width: 100,
      },
    ],
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await queryServiceInfo({
            current: page.currentPage,
            size: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
    },
  } as VxeTableGridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #serviceName="{ row }">
        <Tag>{{ row.serviceName }}</Tag>
        <Tag v-if="row.isCurrentService" color="success">本机</Tag>
      </template>
      <template #operation> </template>
    </Grid>
  </Page>
</template>

<style scoped lang="scss"></style>
