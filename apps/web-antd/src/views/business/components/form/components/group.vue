<script setup lang="ts">
import { defineProps, ref } from 'vue';

import draggable from 'vuedraggable';

import FormGroupTitle from '#/component/form-group-title.vue';
import { useFormStore } from '#/store';

import DraggableComponent from './draggable-component.vue';

const { groupName } = defineProps({
  groupName: {
    type: String,
    default: '模块',
  },
  id: {
    type: String,
    default: '',
  },
});

const formStore = useFormStore();

const formGroup = ref([]);

function handleMove(evt) {
  console.log(evt);
  if (evt.relatedContext && evt.relatedContext.component) {
    const id = evt.relatedContext.component.$attrs.id;
    const group = evt.relatedContext.component.$attrs.group;
    if (group === 'layout') {
      formStore.changeMoveInTarget(group);
    } else if (id) {
      formStore.changeMoveInTarget(id);
    }
  }
  return true;
}
</script>

<template>
  <div>
    <FormGroupTitle :title="groupName" />
    <div class="mb-1 mt-2 border-2 border-dashed bg-gray-50 p-2">
      <div
        v-if="id !== formStore.moveInTarget && formGroup.length === 0"
        class="text-center text-gray-500"
      >
        拖拽基础组件到此处
      </div>
      <draggable
        v-model="formGroup"
        group="basic"
        item-key="type"
        :id="id"
        :move="handleMove"
      >
        <template #item="{ element }">
          <DraggableComponent :element="element" group="basic" />
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
