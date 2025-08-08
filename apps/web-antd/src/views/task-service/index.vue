<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import {
  AntDesignMinusCircleOutlined,
  AntDesignPlusCircleOutlined,
  AntDesignSettingOutlined,
} from '@vben/icons';

import {
  Button,
  Select,
  SelectOption,
  Table,
  Tag,
  Timeline,
  TimelineItem,
} from 'ant-design-vue';

import { getTaskConfigParams, getTaskConfigs } from '#/api/task-service';

const [TaskParamsModal, taskParamsModalApi] = useVbenModal({
  title: '设置任务参数',
});

const tasks = [];
// const subTaskMap = {};
const columns = [
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
const paramsSettingTableColumns = [
  {
    title: '参数名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '参数标识',
    dataIndex: 'key',
    key: 'key',
  },
  {
    title: '参数类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '是否必填',
    dataIndex: 'required',
    key: 'required',
  },
];

const taskMap = ref<Record<string, any>>({});
const dataSource = ref<any[]>([]);

function addTask() {
  dataSource.value.push({
    taskType: null,
    subTaskId: null,
  });
}
function deleteTask(i) {
  dataSource.value.splice(i, 1);
}
function handleTaskTypeChange(i) {
  dataSource.value[i].subTaskId = null;
}
function setTaskParams(i: number) {
  taskParamsModalApi.open();

  const { taskType, subTaskId } = dataSource.value[i];
  currentTaskType.value = taskType;
  currentSubTaskId.value = subTaskId;

  const current = subTaskId
    ? taskMap.value[taskType].subTaskMap[subTaskId]
    : taskMap.value[taskType];

  if (!current.params) {
    taskParamsModalApi.setState({
      loading: true,
    });
    getTaskConfigParams(taskType, subTaskId)
      .then((data) => {
        current.params = data;
      })
      .finally(() => taskParamsModalApi.setState({ loading: false }));
  }
}

const currentTaskType = ref<string>(null);
const currentSubTaskId = ref<string>(null);

const currentParams = computed(() => {
  if (!currentTaskType.value) {
    return [];
  }
  const params = currentSubTaskId.value
    ? taskMap.value[currentTaskType.value].subTaskMap[currentSubTaskId.value]
        .params
    : taskMap.value[currentTaskType.value].params;
  return params || { input: [], output: [] };
});

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
    <TaskParamsModal>
      <Table
        :columns="paramsSettingTableColumns"
        :data-source="currentParams.input"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'required'">
            {{ record.required ? '是' : '否' }}
          </template>
        </template>
      </Table>
    </TaskParamsModal>
    <Table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      bordered
    >
      <template #emptyText>
        <Button type="link" @click="addTask">添加任务</Button>
      </template>
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'taskType'">
          <Select
            class="w-full"
            placeholder="请选择任务类型"
            v-model:value="record.taskType"
            @change="handleTaskTypeChange(index)"
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
            v-model:value="record.subTaskId"
            v-if="taskMap[record.taskType]?.subTaskMap"
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
              @click="setTaskParams(index)"
              v-if="
                record.taskType &&
                (!taskMap[record.taskType].subTaskMap || record.subTaskId)
              "
            />
          </div>
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

<style scoped lang="scss"></style>
