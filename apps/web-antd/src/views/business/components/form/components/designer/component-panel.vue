<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  Button,
  Collapse,
  CollapsePanel,
  Form,
  FormItem,
  Input,
  Menu,
} from 'ant-design-vue';
import draggable from 'vuedraggable';

import { useFormStore } from '#/store';
import { generateShortId } from '#/utils/id-utils';

import { componentsConfig } from '../../components-config';

const formStore = useFormStore();
const [FormModal, formModalApi] = useVbenModal({
  onConfirm: () => {
    formRef.value
      .validate()
      .then(() => {
        const { formKey, formName } = formConfig.value;
        forms.value.push({ key: formKey, label: formName });
        activeForm.value = [formKey];
        formModalApi.close();
      })
      .catch((error) => {
        console.log('error', error);
      });
  },
  onClosed: () => {
    formRef.value.resetFields();
  },
});

const forms = ref([
  {
    key: 'form1',
    label: '表单1',
  },
]);
const formConfig = ref({
  formKey: '',
  formName: '',
  groups: [],
});
const activeForm = ref([]);
const activeKeys = ref<string[]>([
  'forms',
  ...componentsConfig.map((group) => group.groupKey),
]);
const formRef = ref();

function handleClone(e: any) {
  return {
    ...e,
    id: `${e.type}_${generateShortId()}`,
  };
}

function addForm() {
  formModalApi.setState({ title: '添加表单' }).open();
}

function handleMove(evt) {
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

function handleDragEnd() {
  formStore.changeMoveInTarget('');
  formStore.changeMoveOutTarget('');
}

watch(activeForm, (v) => {
  if (v?.length) {
    const form = forms.value.find((item) => item.key === v[0]);
    if (form) {
      formStore.getFormConfig(form.key, form.label);
    }
  }
});

onMounted(() => {
  if (forms.value.length > 0) {
    activeForm.value = [forms.value[0].key];
  }
});
</script>

<template>
  <FormModal>
    <Form :model="formConfig" layout="vertical" ref="formRef">
      <FormItem
        label="表单标识"
        name="formKey"
        :rules="[{ required: true, message: '请输入表单标识' }]"
      >
        <Input
          placeholder="请输入表单标识"
          v-model:value="formConfig.formKey"
        />
      </FormItem>
      <FormItem
        label="表单名称"
        name="formName"
        :rules="[{ required: true, message: '请输入表单名称' }]"
      >
        <Input
          placeholder="请输入表单名称"
          v-model:value="formConfig.formName"
        />
      </FormItem>
    </Form>
  </FormModal>
  <Collapse ghost expand-icon-position="end" v-model:active-key="activeKeys">
    <CollapsePanel key="forms" header="所有表单">
      <template #extra>
        <Button type="primary" size="small" @click.stop="addForm">添加</Button>
      </template>
      <Menu
        v-if="forms.length > 0"
        v-model:selected-keys="activeForm"
        :items="forms"
        mode="inline"
        class="my-2"
      />
      <p v-else class="p-5 text-center text-gray-500">暂无表单</p>
    </CollapsePanel>
    <CollapsePanel
      v-for="group in componentsConfig"
      :key="group.groupKey"
      :header="group.groupName"
    >
      <draggable
        tag="ul"
        class="components"
        :list="group.components"
        :group="{ name: group.groupKey, pull: 'clone', put: false }"
        :clone="handleClone"
        item-key="type"
        :sort="false"
        :move="handleMove"
        @end="handleDragEnd"
      >
        <template #item="{ element }">
          <li class="component">
            {{ element.name }}
          </li>
        </template>
      </draggable>
    </CollapsePanel>
  </Collapse>
</template>

<style scoped lang="scss">
.component {
  @apply border-border text-foreground dark:bg-accent bg-primary/15 hover:text-primary hover:border-primary my-2.5 cursor-move rounded-sm border p-1.5 text-center hover:border-dashed;
}

.ant-collapse {
  :deep(.ant-collapse-item) {
    .ant-collapse-header {
      background: #ededed;
      border-radius: 0;
    }

    .ant-collapse-content {
      .ant-collapse-content-box {
        padding-top: 0;
        padding-bottom: 0;

        .ant-menu {
          border-width: 0;
        }
      }
    }
  }
}
</style>
