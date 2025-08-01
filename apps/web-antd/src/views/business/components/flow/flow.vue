<script setup lang="ts">
import { onMounted } from 'vue';

import LogicFlow from '@logicflow/core';
import {
  Control,
  DndPanel,
  MiniMap,
  SelectionSelect,
} from '@logicflow/extension';

import EndIcon from '#/asserts/flow/end.svg?raw';
import ForkIcon from '#/asserts/flow/fork.svg?raw';
import JoinIcon from '#/asserts/flow/join.svg?raw';
import StartIcon from '#/asserts/flow/start.svg?raw';
import TaskIcon from '#/asserts/flow/task.svg?raw';
import { generateShortId } from '#/utils/id-utils';

import EndNode from './nodes/EndNode';
import ForkNode from './nodes/ForkNode';
import JoinNode from './nodes/JoinNode';
import StartNode from './nodes/StartNode';
import TaskNode from './nodes/TaskNode';

import '@logicflow/core/lib/style/index.css';
import '@logicflow/extension/lib/style/index.css';

const taskIconUrl = `data:image/svg+xml;base64,${btoa(TaskIcon)}`;
const forkIconUrl = `data:image/svg+xml;base64,${btoa(ForkIcon)}`;
const joinIconUrl = `data:image/svg+xml;base64,${btoa(JoinIcon)}`;
const endIconUrl = `data:image/svg+xml;base64,${btoa(EndIcon)}`;
const startIconUrl = `data:image/svg+xml;base64,${btoa(StartIcon)}`;

LogicFlow.use(Control);
LogicFlow.use(DndPanel);
LogicFlow.use(SelectionSelect);
LogicFlow.use(MiniMap);

let lf;

onMounted(() => {
  lf = new LogicFlow({
    container: document.querySelector('#flowContainer') as HTMLElement,
    // grid: {
    //   size: 20, // 网格大小 10px
    //   visible: true, // 渲染网格背景
    // },
    grid: true,
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
        strokeDasharray: '6,4',
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
      type: 'start',
      label: '开始',
      icon: startIconUrl,
    },
    {
      type: 'task',
      text: '用户节点',
      label: '节点',
      icon: taskIconUrl,
    },
    {
      type: 'fork',
      label: '分支',
      icon: forkIconUrl,
    },
    {
      type: 'join',
      label: '汇合',
      icon: joinIconUrl,
    },
    {
      type: 'end',
      label: '结束',
      icon: endIconUrl,
    },
  ]);

  lf.register(TaskNode);
  lf.register(EndNode);
  lf.register(ForkNode);
  lf.register(JoinNode);
  lf.register(StartNode);

  lf.render({});

  lf.extension.miniMap?.show();

  lf.on('history:change', () => console.log('history:change'));
  lf.on('element:click', (data) => console.log('element:click', data));
});
</script>

<template>
  <div id="flowContainer" class="h-full"></div>
</template>

<style scoped lang="scss"></style>
