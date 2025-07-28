<script setup lang="ts">
import { ref, watch } from 'vue';

import { Form } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';

import { useFormStore } from '#/store';

import DraggableComponent from '../draggable-component.vue';

const formStore = useFormStore();
const { currentForm, moveInTarget } = storeToRefs(formStore);

const components = ref([]);

function handleChange(e) {
  if (e.added) {
    formStore.setCurrentComponent(e.added.element);
  }
}

watch(currentForm, (n, o) => {
  console.log('表单切换', n, components.value);
  components.value = n.components || [];
});
watch(components, (v) => formStore.changeCurrentFormComponents(v), {
  deep: true,
});
</script>

<template>
  <div
    v-if="currentForm"
    class="!bg-background text-foreground relative h-full p-3"
  >
    <div
      v-if="moveInTarget !== 'layout' && components.length === 0"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-gray-500"
    >
      拖拽布局组件到此处
    </div>
    <Form class="h-full" layout="vertical">
      <draggable
        class="h-full"
        tag="div"
        v-model="components"
        group="layout"
        item-key="id"
        handle=".handle"
        @change="handleChange"
      >
        <template #item="{ element }">
          <DraggableComponent :element="element" group="layout" />
        </template>
      </draggable>
    </Form>
  </div>
</template>

<style scoped lang="scss"></style>
