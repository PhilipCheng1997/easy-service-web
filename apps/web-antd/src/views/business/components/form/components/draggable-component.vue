<script setup lang="ts">
import { defineProps } from 'vue';

import { LucideMove } from '@vben/icons';

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

function changeCurrentElement(element) {
  formStore.setCurrentComponent(element);
}
</script>

<template>
  <div
    class="group relative mb-2 last:mb-0"
    @click.stop="changeCurrentElement(element)"
  >
    <div
      class="handle bg-primary/15 user-select-none absolute right-0 flex cursor-move items-center p-1 text-xs text-gray-500"
    >
      <LucideMove />
      <span class="ml-1 cursor-move">{{ element.id }}</span>
    </div>
    <div
      v-if="group === 'layout'"
      class="component-wrapper"
      :class="{
        'active-component': element.id === currentComponent?.id,
      }"
    >
      <component
        :is="componentMapping[element.type]"
        :id="element.id"
        v-bind="element.props"
      />
    </div>
    <FormItem
      v-else-if="group === 'basic'"
      :label="element?.props.label || element.name || element.type"
      class="component-wrapper"
      :class="{
        'active-component': element.id === currentComponent?.id,
      }"
    >
      <component :is="componentMapping[element.type]" v-bind="element.props" />
    </FormItem>
  </div>
</template>

<style scoped lang="scss">
.active-component {
  @apply border-primary;
}

.component-wrapper {
  @apply mb-0 border-2 border-dashed bg-gray-50 p-2;
}
</style>
