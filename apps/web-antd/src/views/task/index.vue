<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button, Tag } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { queryTaskLog } from '#/api/task/task-log';

import { columns, formSchema } from './data';

const [Grid] = useVbenVxeGrid({
  formOptions: {
    schema: formSchema,
    submitOnChange: true,
    collapsed: true,
  },
  gridEvents: {},
  gridOptions: {
    columns,
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await queryTaskLog({
            current: page.currentPage,
            size: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      custom: true,
      export: false,
      refresh: { code: 'query' },
      zoom: true,
    },
  } as VxeTableGridOptions,
});

const modalContent = ref<string>('');
const [MessageModal, messageModalApi] = useVbenModal({
  onConfirm: () => messageModalApi.close(),
});

function openModal(content: string) {
  modalContent.value = content;
  messageModalApi.open();
}
</script>

<template>
  <Page auto-content-height>
    <MessageModal class="w-[800px]" title="查看信息" :show-cancel-button="false">
      <p style="white-space: pre-line">{{ modalContent }}</p>
    </MessageModal>
    <Grid table-title="任务日志">
      <template #isExecuted="{ row }">
        <Tag :color="row.isExecuted ? 'success' : 'warning'">
          {{ row.isExecuted ? '已执行' : '未执行' }}
        </Tag>
      </template>
      <template #isSuccess="{ row }">
        <Tag v-if="row.isExecuted" :color="row.isSuccess ? 'success' : 'error'">
          {{ row.isSuccess ? '成功' : '失败' }}
        </Tag>
        <Tag v-else color="warning">未执行</Tag>
      </template>
      <template #scriptOutput="{ row }">
        <Button
          v-if="row.scriptOutput"
          type="link"
          @click="openModal(row.scriptOutput)"
        >
          查看
        </Button>
      </template>
      <template #output="{ row }">
        {{ row.output }}
      </template>
      <template #error="{ row }">
        <Button v-if="row.error" type="link" @click="openModal(row.error)">
          查看
        </Button>
      </template>
      <template #toolbar-tools>
        <Button type="primary"> 查看当日计划 </Button>
      </template>
    </Grid>
  </Page>
</template>
