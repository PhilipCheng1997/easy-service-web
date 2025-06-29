<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';

import { useSchema } from '../data';

const [Form] = useVbenForm({
  schema: useSchema(),
  handleSubmit,
  commonConfig: {
    labelWidth: 150,
    componentProps: {
      class: 'w-full',
      colon: true,
    },
    formItemClass: 'col-span-2 md:col-span-1',
  },
  wrapperClass: 'grid-cols-2 gap-x-4',
});

function handleSubmit() {}
</script>

<template>
  <Page auto-content-height>
    <div class="bg-background p-5">
      <Form />
    </div>
  </Page>
</template>

<style scoped lang="scss"></style>
