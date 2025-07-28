<script setup lang="ts">
import { ref, watch } from 'vue';

import { Form, FormItem, Input, TabPane, Tabs, Tag } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { useFormStore } from '#/store';

import { schemaMapping } from '../../components-config';

const formStore = useFormStore();
const { currentForm, currentComponent } = storeToRefs(formStore);

function handlePropChange(item, e) {
  formStore.updateCurrentComponentProp(item.name, e.target.value);
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
          >
            <template v-if="item.type === 'id'">
              <Tag>{{ currentComponent.id }}</Tag>
            </template>
            <template v-else-if="item.type === 'input'">
              <Input
                placeholder="请输入"
                :value="currentComponent.props[item.name]"
                @change="handlePropChange(item, $event)"
              />
            </template>
          </FormItem>
        </div>
      </Form>
    </TabPane>
  </Tabs>
</template>

<style scoped lang="scss"></style>
