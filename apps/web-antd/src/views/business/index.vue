<script setup lang="ts">
import { ref } from 'vue';

import { JsonViewer, useVbenModal } from '@vben/common-ui';
import { AntDesignDownOutlined } from "@vben/icons";

import {
  Button,
  Layout,
  LayoutContent,
  LayoutHeader,
  Space,
  TabPane,
  Tabs,
  Dropdown,
  Menu,
  MenuItem,
} from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import FormRender from '#/component/form-render.vue';
import { useFormStore } from '#/store';

import Basic from './components/basic.vue';
import Extra from './components/extra.vue';
import Flow from './components/flow.vue';
import Form from './components/form/form.vue';

enum TabsEnum {
  basic = 'basic',
  extra = 'extra',
  flow = 'flow',
  form = 'form',
}

const formStore = useFormStore();
const { currentForm } = storeToRefs(formStore);

const activeKey = ref<string>(TabsEnum.basic);
const tabs = [
  { key: TabsEnum.basic, tab: '基础配置' },
  { key: TabsEnum.form, tab: '表单配置' },
  { key: TabsEnum.flow, tab: '流程配置' },
  { key: TabsEnum.extra, tab: '扩展配置' },
];

const [PreviewFormModal, previewFormModalApi] = useVbenModal({
  title: '表单预览',
});

const previewType = ref('form');

function handleFormPreview(type) {
  previewType.value = type;
  previewFormModalApi.open();
}
</script>

<template>
  <Layout class="flex h-full flex-col">
    <LayoutHeader class="!bg-background text-foreground border-border border-b">
      <Tabs
        v-model:active-key="activeKey"
        centered
        :tab-bar-style="{ margin: 0 }"
      >
        <template #leftExtra>
          <div class="w-[250px]">标题</div>
        </template>
        <TabPane v-for="tab in tabs" :key="tab.key" :tab="tab.tab" />
        <template #rightExtra>
          <Space class="w-[250px] justify-end">
            <Dropdown v-if="activeKey === TabsEnum.form">
              <template #overlay>
                <Menu @click="handleFormPreview($event.key)">
                  <MenuItem key="form">
                    表单预览
                  </MenuItem>
                  <MenuItem key="json">
                    JSON预览
                  </MenuItem>
                </Menu>
              </template>
              <Button>
                <span>预览</span>
                <AntDesignDownOutlined class="mb-1 ml-1" />
              </Button>
            </Dropdown>
            <Button type="primary">发布</Button>
          </Space>
        </template>
      </Tabs>
      <PreviewFormModal>
        <FormRender v-if="previewType === 'form'" :form-config="currentForm" />
        <JsonViewer
          v-if="previewType === 'json'"
          :value="currentForm"
          preview-mode
        />
      </PreviewFormModal>
    </LayoutHeader>
    <LayoutContent class="flex-1">
      <Basic v-show="activeKey === TabsEnum.basic" />
      <Form v-show="activeKey === TabsEnum.form" />
      <Flow v-show="activeKey === TabsEnum.flow" />
      <Extra v-show="activeKey === TabsEnum.extra" />
    </LayoutContent>
  </Layout>
</template>

<style scoped lang="scss">
.ant-layout {
  .ant-layout-header {
    height: 46px;
    line-height: 46px;
  }
}

.ant-tabs-top {
  :deep(.ant-tabs-nav) {
    &::before {
      border: 0;
    }
  }
}
</style>
