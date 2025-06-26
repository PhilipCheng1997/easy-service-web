<script setup lang="ts">
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { computed, ref } from 'vue';

import { Loading, Page, useVbenModal } from '@vben/common-ui';

import {
  Button,
  Descriptions,
  DescriptionsItem,
  message,
  Tag,
} from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { executeTask, getTaskPlan, queryTaskLog } from '#/api';

import { columns, formSchema } from './data';

const loading = ref<boolean>(false);

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
const messageModalError = ref<string>('');
const lines = computed(() => {
  return messageModalContent.value ? messageModalContent.value.split('\n') : [];
});
const [MessageModal, messageModalApi] = useVbenModal({
  onConfirm: () => messageModalApi.close(),
});
function openMessageModal(content: string = '', error: string = '') {
  messageModalContent.value = content;
  messageModalError.value = error;
  messageModalApi.open();
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
  loading.value = true;
  executeTask()
    .then((taskLog) => {
      message.success('执行成功');
      if (taskLog) {
        openMessageModal(taskLog.scriptOutput, taskLog.error);
      }
      gridApi.reload();
    })
    .catch(() => message.error('执行失败'))
    .finally(() => (loading.value = false));
}
</script>

<template>
  <Loading :spinning="loading" text="正在执行任务...">
    <Page auto-content-height>
      <MessageModal title="查看信息" :show-cancel-button="false">
        <p v-if="messageModalError" class="mb-4">
          异常：<Tag color="error">{{ messageModalError }}</Tag>
        </p>
        <div class="terminal" v-if="lines.length > 0">
          <pre v-for="(line, index) in lines" :key="index">{{ line }}</pre>
        </div>
      </MessageModal>
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
          <DescriptionsItem label="开始时间" :span="4">
            {{ taskPlan?.startTime || '-' }}
          </DescriptionsItem>
          <DescriptionsItem label="结束时间" :span="4">
            {{ taskPlan?.endTime || '-' }}
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
            @click="openMessageModal('', row.error)"
          >
            查看
          </Button>
        </template>
        <template #toolbar-tools>
          <Button type="primary" class="mr-1" @click="handleExecuteTask">
            立即执行
          </Button>
          <Button type="primary" @click="openTaskPlanModal">
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
