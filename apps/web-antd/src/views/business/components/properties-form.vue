<script setup lang="ts">
import { computed, defineEmits, defineProps, toRefs } from 'vue';

import {
  AntDesignMinusCircleOutlined,
  AntDesignPlusCircleOutlined,
} from '@vben/icons';

import {
  Button,
  Form,
  FormItem,
  Input,
  RadioGroup,
  Select,
  Switch,
  Table,
  Tag,
  Textarea,
} from 'ant-design-vue';

import flowElementPropsSchemaMapping from './flow/schema-mapping';
import { schemaMapping as formComponentPropsSchemaMapping } from './form/components-config';

const props = defineProps({
  mode: {
    type: String,
    default: '',
  },
  value: {
    type: Object,
    required: true,
  },
});
const emits = defineEmits(['change']);

const { mode, value } = toRefs(props);

const formGroup = computed(() => {
  if (!mode.value || !value.value.type) return [];

  if (mode.value === 'form') {
    return formComponentPropsSchemaMapping[value.value.type];
  } else if (mode.value === 'flow') {
    return flowElementPropsSchemaMapping[value.value.type];
  }

  return {};
});

const modelValue = computed(() => {
  if (mode.value === 'form') {
    return value.value.props;
  } else if (mode.value === 'flow') {
    return value.value;
  }

  return {};
});

const optionsTableColumns = [
  {
    title: '选项值',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '选项描述',
    dataIndex: 'label',
    key: 'label',
  },
  {
    title: '操作',
    key: 'op',
    width: '50px',
  },
];

function handlePropChange(item, v) {
  emits('change', item, v);
}

function getValue(fieldName: string) {
  if (!modelValue.value || !fieldName) {
    return null;
  }
  const keys = fieldName.split('.');
  let result = modelValue.value;
  for (const key of keys) {
    if (!result) return null;
    result = result[key];
  }
  return result;
}

function addOption(item) {
  const newOptions = [
    ...getValue(item.name),
    { value: 'value', label: 'label' },
  ];
  handlePropChange(item, newOptions);
}
function deleteOption(item, index) {
  handlePropChange(
    item,
    getValue(item.name).filter((_, i) => i !== index),
  );
}
</script>

<template>
  <Form v-if="modelValue" :model="modelValue" layout="vertical" size="small">
    <div v-for="(group, i) in formGroup" :key="i">
      <p class="mb-3 font-bold">{{ group.name }}</p>
      <FormItem
        v-for="(item, j) in group.props"
        :key="j"
        :label="item.label"
        :name="item.name"
        :rules="item.rules"
      >
        <template v-if="item.type === 'id'">
          <Tag>{{ value.id }}</Tag>
        </template>
        <template v-else-if="item.type === 'input'">
          <Input
            placeholder="请输入"
            :value="getValue(item.name)"
            @change="handlePropChange(item, $event.target.value)"
          />
        </template>
        <template v-else-if="item.type === 'textarea'">
          <Textarea
            placeholder="请输入"
            :rows="3"
            :value="getValue(item.name)"
            @change="handlePropChange(item, $event.target.value)"
          />
        </template>
        <template v-else-if="item.type === 'select'">
          <Select
            :value="getValue(item.name)"
            @change="handlePropChange(item, $event)"
            class="w-full"
            placeholder="请输入"
            :options="item.options"
          />
        </template>
        <template v-else-if="item.type === 'switch'">
          <Switch
            :checked="getValue(item.name)"
            @change="handlePropChange(item, $event)"
          />
        </template>
        <template v-else-if="item.type === 'radio'">
          <RadioGroup
            :value="getValue(item.name)"
            :name="item.name"
            :options="item.options"
            @change="handlePropChange(item, $event.target.value)"
          />
        </template>
        <template v-else-if="item.type === 'options'">
          <Table
            bordered
            :columns="optionsTableColumns"
            size="small"
            :data-source="getValue(item.name)"
            :pagination="false"
          >
            <template #bodyCell="{ column, record, index }">
              <template v-if="column.key === 'value'">
                <FormItem class="mb-0">
                  <Input
                    placeholder="请输入选项值"
                    v-model:value="record.value"
                  />
                </FormItem>
              </template>
              <template v-else-if="column.key === 'label'">
                <FormItem class="mb-0">
                  <Input
                    placeholder="请输入选项描述"
                    v-model:value="record.label"
                  />
                </FormItem>
              </template>
              <template v-else-if="column.key === 'op'">
                <div class="flex">
                  <AntDesignPlusCircleOutlined
                    class="mr-1 cursor-pointer"
                    @click="addOption(item)"
                  />
                  <AntDesignMinusCircleOutlined
                    class="cursor-pointer"
                    @click="deleteOption(item, index)"
                  />
                </div>
              </template>
            </template>
            <template #emptyText>
              <Button type="link" @click="addOption(item)">添加选项</Button>
            </template>
          </Table>
        </template>
      </FormItem>
    </div>
  </Form>
</template>

<style scoped lang="scss"></style>
