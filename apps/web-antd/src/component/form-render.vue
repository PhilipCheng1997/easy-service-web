<script setup lang="ts">
import {
  Alert,
  Card,
  Checkbox,
  CheckboxGroup,
  Form,
  FormItem,
  Input,
  Select,
  Textarea,
} from 'ant-design-vue';

import FormGroupTitle from '#/component/form-group-title.vue';

const { formConfig } = defineProps({
  formConfig: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <Form v-if="formConfig?.components" layout="vertical">
    <div
      class="mb-4 last:mb-0"
      v-for="component in formConfig.components"
      :key="component.id"
    >
      <template v-if="component.type === 'alert'">
        <Alert
          :show-icon="component.props?.showIcon"
          :message="component.props?.message"
          :type="component.props?.type"
        />
      </template>
      <template v-else-if="component.type === 'group'">
        <Card size="small">
          <template #title>
            <FormGroupTitle :title="component.props?.groupName" />
          </template>
          <p v-if="!component.children?.length" class="text-center">暂无内容</p>
          <FormItem
            v-for="subComponent in component.children"
            :key="subComponent.id"
            :label="subComponent.props?.label"
          >
            <template v-if="subComponent.type === 'input'">
              <Input :placeholder="subComponent.props?.placeholder" />
            </template>
            <template v-if="subComponent.type === 'textarea'">
              <Textarea :placeholder="subComponent.props?.placeholder" />
            </template>
            <template v-if="subComponent.type === 'select'">
              <Select
                :placeholder="subComponent.props?.placeholder"
                :options="subComponent.props?.options"
              />
            </template>
            <template v-if="subComponent.type === 'checkbox'">
              <Checkbox>
                {{ subComponent.props?.content }}
              </Checkbox>
            </template>
            <template v-if="subComponent.type === 'checkboxGroup'">
              <CheckboxGroup :options="subComponent.props?.options" />
            </template>
          </FormItem>
        </Card>
      </template>
    </div>
  </Form>
</template>

<style scoped lang="scss">
</style>
