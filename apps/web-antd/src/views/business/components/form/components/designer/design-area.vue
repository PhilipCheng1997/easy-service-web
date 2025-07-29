<script setup lang="ts">
import { ref, watch } from 'vue';

import { Form } from 'ant-design-vue';
import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';

import { useFormStore } from '#/store';

import DraggableComponent from '../draggable-component.vue';

const draggableGroup = {
  name: 'designArea',
  pull: true,
  put: (_: any, from) => {
    const fromGroup = from.options.group.name;
    return fromGroup !== 'basic' && fromGroup !== 'group';
  },
};

const formStore = useFormStore();
const { currentForm, moveInTarget } = storeToRefs(formStore);

const components = ref([]);

function handleChange(e) {
  if (e.added) {
    formStore.setCurrentComponent(e.added.element);
  }
}

watch(currentForm, (n) => {
  console.log('表单切换', n, components.value);
  components.value = n.components || [];
});
watch(components, (v) => formStore.changeCurrentFormComponents(v), {
  deep: true,
});
</script>

<template>
  <Form
    v-if="currentForm"
    layout="vertical"
    class="!bg-background text-foreground relative h-full p-3"
  >
    <div
      v-if="moveInTarget !== 'layout' && components.length === 0"
      class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-gray-500"
    >
      拖拽组件到此处
    </div>
    <draggable
      class="h-full"
      tag="div"
      v-model="components"
      :group="draggableGroup"
      item-key="id"
      handle=".handle"
      @change="handleChange"
    >
      <template #item="{ element }">
        <DraggableComponent :element="element" :group="element.group" />
      </template>
    </draggable>
  </Form>
</template>

<style scoped lang="scss"></style>
