<script setup lang="ts">
import { watch } from 'vue';

import { Form, FormItem, Input } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { useFormStore } from '#/store';

import { schemaMapping } from '../../components-config';

const formStore = useFormStore();
const { currentComponent } = storeToRefs(formStore);

watch(currentComponent, (v) => console.log(v));
</script>

<template>
  <Form
    :model="currentComponent.props"
    v-if="
      currentComponent &&
      currentComponent.props &&
      schemaMapping[currentComponent.type]
    "
    layout="vertical"
    size="small"
    :key="currentComponent.id"
  >
    <div v-for="(group, i) in schemaMapping[currentComponent.type]" :key="i">
      <p class="mb-3 font-bold">{{ group.name }}</p>
      <FormItem v-for="(item, j) in group.props" :key="j" :label="item.label">
        <template v-if="item.type === 'id'">
          <p class="text-gray-500">{{ currentComponent.id }}</p>
        </template>
        <template v-else-if="item.type === 'input'">
          <Input
            placeholder="请输入"
            v-model:value="currentComponent.props[item.name]"
          />
          <!--                    {{ currentComponent.props[item.name] }}-->
        </template>
      </FormItem>
    </div>
  </Form>
</template>

<style scoped lang="scss"></style>
