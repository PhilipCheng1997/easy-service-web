<script setup lang="ts">
import { computed, defineProps, ref } from 'vue';

import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';

import FormGroupTitle from '#/component/form-group-title.vue';
import { useFormStore } from '#/store';

import DraggableComponent from './draggable-component.vue';

const { groupName, id } = defineProps({
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
const { moveInTarget, moveOutTarget } = storeToRefs(formStore);

const formGroup = ref([]);

const isShowEmptyTip = computed(() => {
  if (moveInTarget.value === id) {
    // 组件拖拽到该组中，隐藏空提示
    return false;
  }
  // 判断组中是否有组件，决定是否显示空提示
  return (
    formGroup.value.filter((item) => item.id !== moveOutTarget.value).length ===
    0
  );
});

function handleMove(evt) {
  if (evt.relatedContext?.component) {
    const id = evt.relatedContext.component.$attrs.id;
    const group = evt.relatedContext.component.$attrs.group;
    if (group === 'layout') {
      formStore.changeMoveInTarget(group);
    } else if (id) {
      formStore.changeMoveInTarget(id);
    }
  }
  if (evt.draggedContext?.element) {
    const { group, id } = evt.draggedContext?.element;
    if (id && group === 'basic') {
      formStore.changeMoveOutTarget(id);
    }
  }
  return true;
}

function handleDragEnd() {
  formStore.changeMoveInTarget('');
  formStore.changeMoveOutTarget('');
}
</script>

<template>
  <div>
    <FormGroupTitle :title="groupName" />
    <div class="mb-1 mt-2 border-2 border-dashed bg-gray-100 p-5">
      <div
        v-if="isShowEmptyTip"
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform text-gray-500"
      >
        拖拽基础组件到此处
      </div>
      <draggable
        v-model="formGroup"
        group="basic"
        item-key="type"
        :id="id"
        :move="handleMove"
        :class="{ 'h-[100px]': isShowEmptyTip }"
        @end="handleDragEnd"
      >
        <template #item="{ element }">
          <DraggableComponent :element="element" group="basic" />
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
