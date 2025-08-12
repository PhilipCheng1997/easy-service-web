<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { AntDesignInfoCircleOutlined } from '@vben/icons';

import {message, Select, SelectOption, Table, Textarea, Tooltip} from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import FormGroupTitle from '#/component/form-group-title.vue';
import { useTaskServiceStore } from '#/store';

const taskServiceStore = useTaskServiceStore();
const { loading } = storeToRefs(taskServiceStore);

const comTypeMapping = {
  0: '字段选择器',
  1: '选择器',
  4: '选项传递',
};
const paramTypeMapping = {
  'java.lang.String': '字符串',
  'java.lang.Integer': '整数',
  'java.lang.Double': '浮点数',
  'java.util.List': '数组',
  'java.util.Map': '对象',
};

const commonColumns = [
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
];
const inputParamsColumns = [
  ...commonColumns,
  {
    title: '是否必填',
    dataIndex: 'required',
    key: 'required',
  },
  {
    title: '参数值',
    key: 'paramValue',
  },
];

const params = ref<Record<string, any[]>>({});
const paramsData = ref<Record<string, any>>({});
const invalidParams = ref<string[]>([]);
const inputParams = computed(() => params.value?.input || []);
const outputParams = computed(() => params.value?.output || []);

const [Modal, modalApi] = useVbenModal({
  title: '任务参数设置',
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const { taskType, subTaskId, data } =
        modalApi.getData<Record<string, any>>();
      paramsData.value = data || {};
      taskServiceStore.getParams(taskType, subTaskId).then((data) => {
        params.value = data;
      });
    } else {
      params.value = {};
      paramsData.value = {};
      invalidParams.value = [];
    }
  },
  onConfirm() {
    validateParams();
    if (invalidParams.value.length === 0) {
      modalApi.setData({ data: paramsData.value });
      modalApi.close();
    } else {
      message.warning('请完善任务参数设置');
    }
  },
});

function handleParamValueChange(item, v) {
  if (!paramsData.value) {
    paramsData.value = {};
  }

  const key = item.key.trim();
  paramsData.value[key] = v;
  if (item.required) {
    if (v?.length && invalidParams.value.includes(key)) {
      invalidParams.value = invalidParams.value.filter((key) => (key !== item.key));
    } else if (!v?.length && !invalidParams.value.includes(key)) {
      invalidParams.value.push(key);
    }
  }
}

function validateParams() {
  invalidParams.value = [];
  for (const inputParam of inputParams.value) {
    if (inputParam.required && (!paramsData.value || !paramsData.value[inputParam.key])) {
      invalidParams.value.push(inputParam.key);
    }
  }
}

watch(loading, (v) => {
  modalApi.setState({ loading: v });
});
</script>

<template>
  <Modal>
    <FormGroupTitle title="入参设置">
      <Table
        :columns="inputParamsColumns"
        :data-source="inputParams"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div class="flex items-center">
              <span>{{ record.name }}</span>
              <Tooltip>
                <template #title>{{ record.memo }}</template>
                <AntDesignInfoCircleOutlined
                  v-if="record.memo?.length"
                  class="text-primary ml-1 size-4 cursor-pointer"
                />
              </Tooltip>
            </div>
          </template>
          <template v-else-if="column.key === 'required'">
            {{ record.required ? '是' : '否' }}
          </template>
          <template v-else-if="column.key === 'comType'">
            {{ comTypeMapping[record.comType] || record.comType }}
          </template>
          <template v-else-if="column.key === 'type'">
            {{ paramTypeMapping[record.type] || record.type }}
          </template>
          <template v-else-if="column.key === 'paramValue'">
            <Select
              v-if="record.comType === 1 && record.values"
              placeholder="请选择"
              class="w-full"
              @change="handleParamValueChange(record, $event)"
            >
              <SelectOption v-for="item in record.values" :key="item.value">
                {{ item.name }}
              </SelectOption>
            </Select>
            <Textarea
              v-else
              placeholder="请输入参数值"
              :status="invalidParams.includes(record.key) ? 'error' : ''"
              :value="paramsData[record.key]"
              @change="handleParamValueChange(record, $event.target.value)"
            />
          </template>
        </template>
      </Table>
    </FormGroupTitle>
    <FormGroupTitle
      title="出参设置"
      class="mt-5"
      v-if="outputParams.length > 0"
    >
      <Table
        :columns="commonColumns"
        :data-source="outputParams"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            {{ paramTypeMapping[record.type] || record.type }}
          </template>
        </template>
      </Table>
    </FormGroupTitle>
  </Modal>
</template>

<style scoped lang="scss"></style>
