<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';
import type { PermissionApi } from '#/api/system';

import { computed, defineEmits, ref } from 'vue';

import { useVbenForm, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { addPermission, updatePermission } from '#/api/system';

import { useSchema } from '../data';

const emit = defineEmits(['success']);

const formData = ref<PermissionApi.SysPermission>();

const modalTitle = computed(() => {
  return formData.value?.id ? '修改权限' : '添加权限';
});

const schema = computed<VbenFormSchema[]>(() => useSchema(formData.value?.id));

const [Modal, modalApi] = useVbenModal({
  onConfirm: handleModalConfirm,
  onOpenChange(isOpen) {
    if (isOpen) {
      const data = modalApi.getData<PermissionApi.SysPermission>();
      if (data) {
        if (data.pid === 0) {
          data.pid = undefined;
        }
        formData.value = data;
        formApi.setValues(formData.value);
      }
    }
  },
});

const [Form, formApi] = useVbenForm({
  layout: 'vertical',
  schema,
  showDefaultActions: false,
});

async function handleModalConfirm() {
  const { valid } = await formApi.validate();
  if (valid) {
    modalApi.lock();
    const data = (await formApi.getValues()) as PermissionApi.SysPermission;
    data.id = formData.value?.id;
    try {
      await (data?.id ? updatePermission(data) : addPermission(data));
      message.success(`${data?.id ? '修改' : '添加'}成功`);
      modalApi.close();
      emit('success');
    } finally {
      modalApi.lock(false);
    }
  }
}
</script>

<template>
  <Modal :title="modalTitle">
    <Form class="mx-4" />
  </Modal>
</template>

<style scoped></style>
