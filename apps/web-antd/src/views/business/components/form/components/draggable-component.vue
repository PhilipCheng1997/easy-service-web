<script setup lang="ts">
import { computed, defineProps, ref } from 'vue';

import {
  AntDesignCopyOutlined,
  AntDesignDeleteOutlined,
  LucideMove,
} from '@vben/icons';

import { FormItem } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { useFormStore } from '#/store';

import { componentMapping } from '../components-config';

const { element } = defineProps({
  group: {
    type: String,
    required: true,
  },
  element: {
    type: Object,
    required: true,
  },
});

const formStore = useFormStore();
const { currentComponent } = storeToRefs(formStore);

const componentWrapperClass = computed(() => {
  return {
    'border-primary': element.id === currentComponent.value?.id,
    'hover:border-primary/50': element.id !== currentComponent.value?.id,
  };
});

function changeCurrentElement(element: any) {
  formStore.setCurrentComponent(element);
}

const hoverElementIds = ref<string[]>([]);
function handleMouseEnter(id: string) {
  hoverElementIds.value.push(id);
}
function handleMouseLeave(id: string) {
  hoverElementIds.value = hoverElementIds.value.filter(
    (elId: string) => elId !== id,
  );
}
</script>

<template>
  <div
    class="relative mb-2 last:mb-0"
    @click.stop="changeCurrentElement(element)"
    @mouseenter="handleMouseEnter(element.id)"
    @mouseleave="handleMouseLeave(element.id)"
  >
    <!-- 右上角组件标识 -->
    <span
      class="bg-primary/15 absolute right-0 z-50 px-2 py-1 text-xs text-gray-500"
    >
      {{ element.id }}
    </span>
    <!-- 右下角工具类 -->
    <div
      v-show="hoverElementIds.includes(element.id)"
      class="absolute bottom-0 right-0 z-50 flex"
    >
      <AntDesignCopyOutlined
        class="bg-primary/15 ml-1 h-6 w-6 cursor-pointer p-1"
      />
      <AntDesignDeleteOutlined
        class="bg-primary/15 ml-1 h-6 w-6 cursor-pointer p-1"
      />
      <LucideMove class="bg-primary/15 handle ml-1 h-6 w-6 cursor-move p-1" />
    </div>
    <!-- 布局组件-->
    <div
      v-if="group === 'layout'"
      class="component-wrapper"
      :class="componentWrapperClass"
    >
      <component
        :is="componentMapping[element.type]"
        :id="element.id"
        :group="element"
        v-bind="element.props"
      />
    </div>
    <!-- 表单组件 -->
    <FormItem
      v-else-if="group === 'basic'"
      :label="element?.props.label || element.name || element.type"
      class="component-wrapper"
      :class="componentWrapperClass"
    >
      <component :is="componentMapping[element.type]" v-bind="element.props" />
    </FormItem>
  </div>
</template>

<style scoped lang="scss">
.component-wrapper {
  @apply mb-0 border-2 border-dashed bg-gray-50 p-2;
}
</style>
