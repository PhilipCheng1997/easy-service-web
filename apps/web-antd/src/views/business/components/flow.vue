<script setup lang="ts">
import { onMounted } from 'vue';

import LogicFlow from '@logicflow/core';
import { Control } from '@logicflow/extension';

import '@logicflow/core/lib/style/index.css';
import '@logicflow/extension/lib/style/index.css';

LogicFlow.use(Control);

onMounted(() => {
  const lf = new LogicFlow({
    container: document.querySelector('#flowContainer') as HTMLElement,
    grid: true,
  });
  lf.render({});
});
</script>

<template>
  <div id="flowContainer" class="h-full"></div>
</template>

<style scoped lang="scss"></style>
