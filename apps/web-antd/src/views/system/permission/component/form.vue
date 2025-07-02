<script setup lang="ts">
import type { PermissionApi } from '#/api/system';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

const formData = ref<PermissionApi.SysPermission>();

const modalTitle = computed(() => {
  return formData.value?.id ? '修改权限' : '添加权限';
});

const [Modal, modalApi] = useVbenModal({
  title: modalTitle,
});
</script>

<template>
  <Modal />
</template>

<style scoped></style>
