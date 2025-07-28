<script setup lang="ts">
import { computed, toRefs, watch } from 'vue';

import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';

import FormGroupTitle from '#/component/form-group-title.vue';
import { useFormStore } from '#/store';

import DraggableComponent from './draggable-component.vue';

const props = defineProps({
  groupName: {
    type: String,
    default: '模块',
  },
  group: {
    type: Object,
    default: () => {},
  },
});
const { groupName, group } = toRefs(props);

const draggableGroup = {
  name: 'layout',
  pull: true,
  put: (_, from) => {
    return from.options.group.name !== 'layout';
  },
};

const formStore = useFormStore();
const { moveInTarget, moveOutTarget } = storeToRefs(formStore);

const isShowEmptyTip = computed(() => {
  if (moveInTarget.value === group.value.id) {
    // 组件拖拽到该组中，隐藏空提示
    return false;
  }
  // 判断组中是否有组件，决定是否显示空提示
  return (
    group.value.children.filter((item) => item.id !== moveOutTarget.value)
      .length === 0
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

function handleChange(e) {
  if (e.added) {
    formStore.setCurrentComponent(e.added.element);
  }
}

watch(
  () => group.value.children,
  (v) => console.log(group.value),
  { deep: true },
);
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
        v-model="group.children"
        :group="draggableGroup"
        item-key="type"
        handle=".handle"
        :id="group.id"
        :move="handleMove"
        :class="{ 'h-[100px]': isShowEmptyTip }"
        @end="handleDragEnd"
        @change="handleChange"
      >
        <template #item="{ element }">
          <DraggableComponent :element="element" group="basic" />
        </template>
      </draggable>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
