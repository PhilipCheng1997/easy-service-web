<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addMenu, getMenu, MenuApi, updateMenu } from '#/api/system';

import { useSchema } from '../data';

const loading = ref<boolean>(false);

const route = useRoute();
const router = useRouter();
const menuId = computed(() => {
  const id = route.params.id;
  const num = Number(id);
  return Number.isFinite(num) && num > 0 ? num : undefined;
});

const breakpoints = useBreakpoints(breakpointsTailwind);
const isHorizontal = computed(() => breakpoints.greaterOrEqual('md').value);

const [Form, formApi] = useVbenForm({
  schema: useSchema(menuId.value),
  handleSubmit,
  commonConfig: {
    labelWidth: 150,
    componentProps: {
      class: 'w-full',
      colon: true,
    },
    formItemClass: 'col-span-2 md:col-span-1',
  },
  resetButtonOptions: {
    content: '取消',
  },
  handleReset() {
    router.go(-1);
  },
  wrapperClass: 'grid-cols-2 gap-x-4',
});

async function handleSubmit() {
  loading.value = true;
  try {
    const { valid } = await formApi.validate();
    if (valid) {
      const data = await formApi.getValues<MenuApi.SysMenu>();
      if (data.type === MenuApi.MenuType.LINK) {
        data.meta = { ...data.meta, link: data.linkSrc };
      } else if (data.type === MenuApi.MenuType.EMBEDDED) {
        data.meta = { ...data.meta, iframeSrc: data.linkSrc };
      }
      delete data.linkSrc;

      if (menuId.value) {
        data.id = menuId.value;
        await updateMenu(data);
        message.success('更新成功');
      } else {
        await addMenu(data);
        message.success('添加成功');
      }
      router.go(-1);
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (menuId.value) {
    loading.value = true;
    getMenu(menuId.value)
      .then((m) => {
        if (m.pid === 0) {
          m.pid = undefined;
        }
        formApi.setValues(m);
      })
      .finally(() => (loading.value = false));
  }
});
</script>

<template>
  <Page auto-content-height v-loading="loading">
    <div class="bg-background p-5">
      <Form :layout="isHorizontal ? 'horizontal' : 'vertical'" />
    </div>
  </Page>
</template>

<style scoped lang="scss"></style>
