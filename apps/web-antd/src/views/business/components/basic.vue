<script setup lang="ts">
import { Card, Form, FormItem, Input } from 'ant-design-vue';
</script>

<template>
  <Card title="基础设置" class="m-4 mx-auto max-w-[1000px]">
    <Form layout="vertical">
      <FormItem label="业务名称">
        <Input placeholder="请输入业务名称" />
      </FormItem>
      <FormItem label="业务标识">
        <Input placeholder="请输入业务标识" />
      </FormItem>
    </Form>
  </Card>
</template>

<style scoped lang="scss"></style>
