<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import { Page } from '@vben/common-ui';
import { useTabs } from '@vben/hooks';

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { addMenu, getMenu, MenuApi, updateMenu } from '#/api/system';

import { useSchema } from '../data';

const { closeCurrentTab } = useTabs();

const loading = ref<boolean>(false);

const route = useRoute();

const menuId = computed(() => {
  const id = route.params.id;
  const num = Number(id);
  return Number.isFinite(num) && num > 0 ? num : undefined;
});
const pid = computed(() => {
  const pid = route.query.pid;
  const num = Number(pid);
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
    closeCurrentTab();
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
      closeCurrentTab();
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
        if (m.type === MenuApi.MenuType.EMBEDDED) {
          m.linkSrc = m.meta?.iframeSrc;
        } else if (m.type === MenuApi.MenuType.LINK) {
          m.linkSrc = m.meta?.link;
        }
        formApi.setValues(m);
      })
      .finally(() => (loading.value = false));
  } else if (pid.value) {
    formApi.setValues({ pid: pid.value });
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
