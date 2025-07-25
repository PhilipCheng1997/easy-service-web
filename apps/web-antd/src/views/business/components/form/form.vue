<script setup lang="ts">
import { Layout, LayoutContent, LayoutSider } from 'ant-design-vue';

import ComponentPanel from './components/designer/component-panel.vue';
import DesignArea from './components/designer/design-area.vue';
import PropertiesPanel from './components/designer/properties-panel.vue';
</script>

<template>
  <Layout class="h-full">
    <LayoutSider
      :width="300"
      class="!bg-background text-foreground border-border border-r"
    >
      <ComponentPanel />
    </LayoutSider>
    <LayoutContent class="h-full p-4">
      <DesignArea />
    </LayoutContent>
    <LayoutSider
      :width="300"
      class="!bg-background text-foreground border-border border-l p-3"
    >
      <PropertiesPanel />
    </LayoutSider>
  </Layout>
</template>

<style scoped lang="scss"></style>
