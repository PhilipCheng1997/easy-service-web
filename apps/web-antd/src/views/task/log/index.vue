<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Loading, Page, useVbenModal } from '@vben/common-ui';

import {
  Button,
  Checkbox,
  Descriptions,
  DescriptionsItem,
  Tag,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getTaskPlan, queryTaskLog } from '#/api';

import TermModal from './component/term-modal.vue';
import { columns, formSchema } from './data';

const loading = ref<boolean>(false);
const isSkipTimeCheck = ref<boolean>(false);

const [Grid, gridApi] = useVbenVxeGrid({
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

const messageModalContent = ref<string>('');
const [MessageModal, messageModalApi] = useVbenModal({
  onConfirm: () => messageModalApi.close(),
  connectedComponent: TermModal,
  closeOnClickModal: false,
});
function openMessageModal(
  content: string = '',
  action: 'error' | 'execute' | 'output' = 'output',
) {
  messageModalContent.value = content;
  messageModalApi.setData({ action, content }).open();
}

const taskPlan = ref<any>({});
const [TaskPlanModal, taskPlanModalApi] = useVbenModal({
  onConfirm: () => taskPlanModalApi.close(),
});
function openTaskPlanModal() {
  taskPlanModalApi.open();
  taskPlanModalApi.setState({ loading: true });
  getTaskPlan()
    .then((data) => {
      taskPlan.value = data;
    })
    .finally(() => {
      taskPlanModalApi.setState({ loading: false });
    });
}

function handleExecuteTask() {
  messageModalApi
    .setData({ action: 'execute', isSkipTimeCheck: isSkipTimeCheck.value })
    .open();
}
</script>

<template>
  <Loading :spinning="loading" text="正在执行任务...">
    <Page auto-content-height>
      <MessageModal
        title="查看信息"
        :show-cancel-button="false"
        @success="() => gridApi.reload()"
      />
      <TaskPlanModal title="查看当日执行计划" :show-cancel-button="false">
        <Descriptions layout="horizontal" bordered>
          <DescriptionsItem label="预计执行时间" :span="4">
            {{ taskPlan?.executableTime || '-' }}
          </DescriptionsItem>
          <DescriptionsItem v-if="taskPlan" label="执行状态" :span="4">
            {{ taskPlan.latestSuccessful?.executeTime || '' }}
            <Tag :color="taskPlan.latestSuccessful ? 'success' : 'warning'">
              {{
                taskPlan.latestSuccessful
                  ? '已执行'
                  : taskPlan.isHoliday
                    ? '无需执行'
                    : '待执行'
              }}
            </Tag>
          </DescriptionsItem>
          <DescriptionsItem label="执行范围" :span="4">
            {{ taskPlan?.startTime || '-' }} ~ {{ taskPlan?.endTime || '-' }}
          </DescriptionsItem>
          <DescriptionsItem label="随机分钟" :span="4">
            {{ taskPlan?.delayMinutes || '-' }}
          </DescriptionsItem>
          <DescriptionsItem label="output文件内容" :span="4">
            {{ taskPlan?.latestSuccessful?.output || taskPlan?.output || '-' }}
          </DescriptionsItem>
        </Descriptions>
      </TaskPlanModal>
      <Grid table-title="任务日志">
        <template #isExecuted="{ row }">
          <Tag :color="row.isExecuted ? 'success' : 'warning'">
            {{ row.isExecuted ? '已执行' : '未执行' }}
          </Tag>
        </template>
        <template #isSuccess="{ row }">
          <Tag
            v-if="row.isExecuted"
            :color="row.isSuccess ? 'success' : 'error'"
          >
            {{ row.isSuccess ? '成功' : '失败' }}
          </Tag>
          <Tag v-else color="warning">未执行</Tag>
        </template>
        <template #scriptOutput="{ row }">
          <Button
            v-if="row.scriptOutput"
            type="link"
            @click="openMessageModal(row.scriptOutput)"
          >
            查看
          </Button>
        </template>
        <template #output="{ row }">
          {{ row.output }}
        </template>
        <template #error="{ row }">
          <Button
            v-if="row.error"
            type="link"
            @click="openMessageModal(row.error, 'error')"
          >
            查看
          </Button>
        </template>
        <template #isNotified="{ row }">
          <span v-if="!row.isExecuted || row.isNotified === -1">
            <Tag>无需执行</Tag>
          </span>
          <span v-else-if="row.isNotified === 1">
            <Tag color="success">已执行</Tag>
          </span>
          <span v-else>
            <Tag color="warning">待执行</Tag>
          </span>
        </template>
        <template #executeRange="{ row }">
          {{ row.startTime }} ~ {{ row.endTime }}
        </template>
        <template #toolbar-tools>
          <Checkbox v-model:checked="isSkipTimeCheck">跳过检查</Checkbox>
          <Button
            type="primary"
            class="mr-1"
            @click="handleExecuteTask"
            size="small"
          >
            立即执行
          </Button>
          <Button type="primary" @click="openTaskPlanModal" size="small">
            查看执行计划
          </Button>
        </template>
      </Grid>
    </Page>
  </Loading>
</template>

<style lang="scss" scoped>
.terminal {
  max-height: 400px;
  padding: 15px;
  overflow-y: auto;
  font-family: monospace;
  color: #d4d4d4;
  background: #1e1e1e;
  border-radius: 4px;

  pre {
    line-height: 25px;
  }
}
</style>
