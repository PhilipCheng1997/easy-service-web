<script setup lang="ts">
import { onMounted, ref } from 'vue';

import LogicFlow from '@logicflow/core';
import {
  Control,
  DndPanel,
  MiniMap,
  SelectionSelect,
} from '@logicflow/extension';
import { Layout, LayoutContent, LayoutSider } from 'ant-design-vue';

import { generateShortId } from '#/utils/id-utils';

import PropertiesForm from '../properties-form.vue';
import End from './nodes/end';
import Fork from './nodes/fork';
import Join from './nodes/join';
import Start from './nodes/start';
import Task from './nodes/task';

import '@logicflow/core/lib/style/index.css';
import '@logicflow/extension/lib/style/index.css';

LogicFlow.use(Control);
LogicFlow.use(DndPanel);
LogicFlow.use(SelectionSelect);
LogicFlow.use(MiniMap);

let lf: LogicFlow;

const currentElement = ref<any>(null);

onMounted(() => {
  lf = new LogicFlow({
    container: document.querySelector('#flowContainer') as HTMLElement,
    grid: true,
    keyboard: {
      enabled: true,
    },
    animation: true,
    partial: true,
    edgeType: 'bezier',
    idGenerator(type: string) {
      return `${type}_${generateShortId()}`;
    },
    pluginsOptions: {
      miniMap: {
        width: 200,
        height: 120,
      },
    },
    style: {
      outline: {
        fill: 'transparent',
        stroke: '#0960be',
        strokeWidth: 2,
        strokeDasharray: '6,3',
        hover: {
          stroke: '#0960be80',
        },
      },
      snapline: {
        stroke: '#0960be', // 对齐线颜色
        strokeWidth: 1, // 对齐线宽度
      },
    },
  });

  lf.extension.dndPanel?.setPatternItems([
    {
      type: Start.type,
      label: Start.label,
      icon: Start.icon,
    },
    {
      type: Task.type,
      text: '用户节点',
      label: Task.label,
      icon: Task.icon,
    },
    {
      type: Fork.type,
      label: Fork.label,
      icon: Fork.icon,
    },
    {
      type: Join.type,
      label: Join.label,
      icon: Join.icon,
    },
    {
      type: End.type,
      label: End.label,
      icon: End.icon,
    },
  ]);

  lf.register(Task);
  lf.register(End);
  lf.register(Fork);
  lf.register(Join);
  lf.register(Start);

  lf.render({});

  lf.extension.miniMap?.show();

  lf.on('element:click', (data) => {
    currentElement.value = data.data;
  });
  lf.on('node:dnd-add', (data) => {
    currentElement.value = data.data;
    lf.selectElementById(data.data.id);
  });
  lf.on('blank:mousedown', () => {
    setTimeout(() => {
      currentElement.value = null;
    }, 5);
  });
  lf.on('node:delete,edge:delete', (data) => {
    if (currentElement.value?.id === data.data.id) {
      currentElement.value = null;
    }
  });
});

function handlePropsChange(item, v) {
  console.log('handlePropsChange', item, v);
  if (item.name === 'text.value') {
    lf.updateText(currentElement.value.id, v);
  }
  currentElement.value = lf.getDataById(currentElement.value.id);
}
</script>

<template>
  <Layout class="h-full">
    <LayoutContent>
      <div id="flowContainer" class="h-full"></div>
    </LayoutContent>
    <LayoutSider
      :width="300"
      :collapsed-width="0"
      :collapsed="!currentElement"
      class="!bg-background text-foreground border-border"
      :class="{ 'p-3': !!currentElement, 'border-l': !!currentElement }"
    >
      <PropertiesForm
        v-if="currentElement"
        :value="currentElement"
        mode="flow"
        @change="handlePropsChange"
      />
    </LayoutSider>
  </Layout>
</template>

<style scoped lang="scss"></style>
