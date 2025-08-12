<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import {
  AntDesignMinusCircleOutlined,
  AntDesignPlusCircleOutlined,
  AntDesignSettingOutlined,
} from '@vben/icons';

import {
  Button,
  message,
  Select,
  SelectOption,
  Table,
  Tag,
  Timeline,
  TimelineItem,
} from 'ant-design-vue';

import { executeTasks, getTaskConfigs } from '#/api/task-service';
import { generateShortId } from '#/utils/id-utils';

import ParamSettingModal from './components/ParamSettingModal.vue';

const [TaskParamsModal, taskParamsModalApi] = useVbenModal({
  title: '设置任务参数',
  connectedComponent: ParamSettingModal,
  onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      const { data } = taskParamsModalApi.getData();
      dataSource.value[currentIndex.value].data = data;
    }
  },
});

const tasks = [];
const columns = [
  {
    title: '序号',
    key: 'index',
  },
  {
    title: '任务类型',
    dataIndex: 'taskType',
    key: 'taskType',
  },
  {
    title: '子任务',
    dataIndex: 'subTaskId',
    key: 'subTaskId',
  },
  {
    title: '操作',
    key: 'op',
  },
  {
    title: '测试执行',
    key: 'execute',
    customCell: (_, i: number) => {
      return i === 0 ? { rowSpan: dataSource.value.length } : { rowSpan: 0 };
    },
  },
];

const taskMap = ref<Record<string, any>>({});
const dataSource = ref<any[]>([]);
const invalidItems = ref<string[]>([]);
const currentIndex = ref<number>(-1);

function addTask() {
  dataSource.value.push({
    taskType: null,
    subTaskId: null,
    id: generateShortId(),
    data: null,
  });
}
function deleteTask(i) {
  dataSource.value.splice(i, 1);
  validateTasks();
}
function handleTaskChange(i: number, key: string, v: any) {
  const task = dataSource.value[i];
  if (key === 'taskType') {
    task.subTaskId = null;
  }
  if (!task[key]) {
    const invalidItemIndex = invalidItems.value.indexOf(task.id);
    if (invalidItemIndex !== -1) {
      invalidItems.value.splice(invalidItemIndex, 1);
    }
  }
  task[key] = v;
}
async function setTaskParams(i: number) {
  currentIndex.value = i;
  const { taskType, subTaskId, data } = dataSource.value[i];
  taskParamsModalApi.setData({ taskType, subTaskId, data }).open();
}
function validateTasks() {
  invalidItems.value = [];
  for (const task of dataSource.value) {
    if (!task.taskType) {
      invalidItems.value.push(task.id);
      continue;
    }
    if (taskMap.value[task.taskType].subTaskMap && !task.subTaskId) {
      invalidItems.value.push(task.id);
      continue;
    }
    if (!task.data) {
      invalidItems.value.push(task.id);
    }
  }
}
function handleExecuteTasks() {
  validateTasks();
  if (invalidItems.value.length > 0) {
    message.warning('请先完善任务参数');
    return;
  }
  executeTasks(dataSource.value);
}

onMounted(() => {
  getTaskConfigs().then((data) => {
    for (const task of data) {
      if (!task?.value) {
        continue;
      }
      tasks.push(task);

      const newTask = { ...task };
      if (newTask.children?.length) {
        newTask.subTaskMap = {};
        for (const subTask of newTask.children) {
          newTask.subTaskMap[subTask.value] = subTask;
        }
      }
      taskMap.value[newTask.value] = newTask;
    }
  });
});
</script>

<template>
  <Page>
    <TaskParamsModal class="w-[800px]" />
    <Table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      bordered
    >
      <template #emptyText>
        <Button type="link" @click="addTask">添加任务</Button>
      </template>
      <template #headerCell="{ title, column }">
        <template v-if="column.key === 'execute'">
          <span>{{ title }}</span>
          <Button
            type="primary"
            class="ml-2"
            size="small"
            :disabled="dataSource.length === 0"
            @click="handleExecuteTasks"
          >
            执行
          </Button>
        </template>
        <template v-else-if="column.key === 'taskType'">
          <span class="required-column-title">{{ title }}</span>
        </template>
        <template v-else-if="column.key === 'subTaskId'">
          <span class="required-column-title">{{ title }}</span>
        </template>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'taskType'">
          <Select
            class="w-full"
            placeholder="请选择任务类型"
            :value="record.taskType"
            :status="
              invalidItems.includes(record.id) && !record.taskType
                ? 'error'
                : ''
            "
            @change="handleTaskChange(index, 'taskType', $event)"
          >
            <SelectOption
              v-for="task in tasks"
              :key="task.value"
              :value="task.value"
              :disabled="task.extraValue && index !== 0"
            >
              <span>{{ task.label }}</span>
              <Tag
                v-if="task.extraValue"
                size="small"
                class="ml-1"
                color="success"
              >
                用户交互
              </Tag>
            </SelectOption>
          </Select>
        </template>
        <template v-else-if="column.key === 'subTaskId'">
          <Select
            class="w-full"
            placeholder="请选择子任务"
            :value="record.subTaskId"
            :status="
              invalidItems.includes(record.id) && !record.subTaskId
                ? 'error'
                : ''
            "
            v-if="taskMap[record.taskType]?.subTaskMap"
            @change="handleTaskChange(index, 'subTaskId', $event)"
          >
            <SelectOption
              v-for="subTask in taskMap[record.taskType].children"
              :key="subTask.value"
              :value="subTask.value"
            >
              <span>{{ subTask.label }}</span>
            </SelectOption>
          </Select>
          <span v-else class="text-gray-400">无子任务</span>
        </template>
        <template v-else-if="column.key === 'op'">
          <div class="flex">
            <AntDesignPlusCircleOutlined
              class="mr-1 size-5 cursor-pointer"
              @click="addTask"
            />
            <AntDesignMinusCircleOutlined
              class="mr-1 size-5 cursor-pointer"
              @click="deleteTask(index)"
            />
            <AntDesignSettingOutlined
              class="mr-1 size-5 cursor-pointer"
              :class="{
                'error-status':
                  invalidItems.includes(record.id) && !record.data,
              }"
              @click="setTaskParams(index)"
              v-if="
                record.taskType &&
                (!taskMap[record.taskType].subTaskMap || record.subTaskId)
              "
            />
          </div>
        </template>
        <template v-else-if="column.key === 'index'">
          {{ index + 1 }}
        </template>
        <template v-else-if="column.key === 'execute'">
          <Timeline>
            <TimelineItem color="gray" v-for="(item, i) in dataSource" :key="i">
              <p v-if="item.taskType">
                {{ taskMap[item.taskType].label }}
                <span v-if="item.subTaskId" class="text-gray-400">
                  <br />{{
                    taskMap[item.taskType].subTaskMap[item.subTaskId].label
                  }}
                </span>
              </p>
              <p v-else class="text-gray-400">请选择任务</p>
            </TimelineItem>
          </Timeline>
        </template>
      </template>
    </Table>
  </Page>
</template>

<style scoped lang="scss">
.required-column-title::before {
  display: inline-block;
  margin-inline-end: 4px;
  color: #ff4d4f;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}
.error-status {
  color: #ff4d4f;
}
</style>
