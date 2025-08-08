<script setup lang="ts">
import { ref, watch } from 'vue';

import { Form, FormItem, Input, TabPane, Tabs } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { useFormStore } from '#/store';

import PropertiesForm from '../../../properties-form.vue';

const formStore = useFormStore();
const { currentForm, currentComponent } = storeToRefs(formStore);

function handlePropChange(item, v) {
  formStore.updateCurrentComponentProp(
    item.name,
    item.formatter ? item.formatter(v) : v,
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
      <PropertiesForm
        v-if="currentComponent"
        :value="currentComponent"
        mode="form"
        @change="handlePropChange"
      />
    </TabPane>
  </Tabs>
</template>

<style scoped lang="scss"></style>
