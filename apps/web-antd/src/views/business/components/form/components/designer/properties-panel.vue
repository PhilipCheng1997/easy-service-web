<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import {
  AntDesignMinusCircleOutlined,
  AntDesignPlusCircleOutlined,
} from '@vben/icons';

import {
  Button,
  Form,
  FormItem,
  Input,
  Select,
  SelectOption,
  Switch,
  Table,
  TabPane,
  Tabs,
  Tag,
  Textarea,
} from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { useFormStore } from '#/store';

import { schemaMapping } from '../../components-config';

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

const formStore = useFormStore();
const { currentForm, currentComponent } = storeToRefs(formStore);
const componentProps = computed(() => {
  return currentComponent.value?.props || {};
});

function handlePropChange(item, v) {
  formStore.updateCurrentComponentProp(
    item.name,
    item.formatter ? item.formatter(v) : v,
  );
}

function addOption(item) {
  const newOptions = [
    ...componentProps.value[item.name],
    { value: 'value', label: 'label' },
  ];
  handlePropChange(item, newOptions);
}
function deleteOption(item, index) {
  handlePropChange(
    item,
    componentProps.value[item.name].filter((_, i) => i !== index),
  );
}

const activeTab = ref('');
watch(currentForm, () => {
  activeTab.value = 'form';
});
watch(currentComponent, (v) => {
  if (v) {
    activeTab.value = 'component';
  }
});
</script>

<template>
  <Tabs centered v-model:active-key="activeTab">
    <TabPane key="form" tab="表单配置" class="px-3">
      <Form
        :model="currentForm"
        v-if="currentForm"
        layout="vertical"
        size="small"
      >
        <FormItem label="表单标识" name="formKey">
          <Input v-model:value="currentForm.formKey" disabled />
        </FormItem>
        <FormItem label="表单名称" name="formName">
          <Input v-model:value="currentForm.formName" required />
        </FormItem>
      </Form>
    </TabPane>
    <TabPane key="component" tab="组件配置" class="px-3">
      <Form
        :model="currentComponent.props"
        v-if="
          currentComponent &&
          currentComponent.props &&
          schemaMapping[currentComponent.type]
        "
        layout="vertical"
        size="small"
        :key="currentComponent.id"
      >
        <div
          v-for="(group, i) in schemaMapping[currentComponent.type]"
          :key="i"
        >
          <p class="mb-3 font-bold">{{ group.name }}</p>
          <FormItem
            v-for="(item, j) in group.props"
            :key="j"
            :label="item.label"
            :name="item.name"
            :rules="item.rules"
          >
            <template v-if="item.type === 'id'">
              <Tag>{{ currentComponent.id }}</Tag>
            </template>
            <template v-else-if="item.type === 'input'">
              <Input
                placeholder="请输入"
                :value="componentProps[item.name]"
                @change="handlePropChange(item, $event.target.value)"
              />
            </template>
            <template v-else-if="item.type === 'textarea'">
              <Textarea
                placeholder="请输入"
                :rows="3"
                :value="componentProps[item.name]"
                @change="handlePropChange(item, $event.target.value)"
              />
            </template>
            <template v-else-if="item.type === 'select'">
              <Select
                :value="componentProps[item.name]"
                @change="handlePropChange(item, $event)"
                class="w-full"
                placeholder="请输入"
              >
                <SelectOption
                  v-for="op in item.options"
                  :key="op.value"
                  :value="op.value"
                >
                  {{ op.label }}
                </SelectOption>
              </Select>
            </template>
            <template v-else-if="item.type === 'switch'">
              <Switch
                :checked="componentProps[item.name]"
                @change="handlePropChange(item, $event)"
              />
            </template>
            <template v-else-if="item.type === 'options'">
              <Table
                bordered
                :columns="optionsTableColumns"
                size="small"
                :data-source="componentProps[item.name]"
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
    </TabPane>
  </Tabs>
</template>

<style scoped lang="scss"></style>
