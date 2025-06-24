<script setup lang="ts">
import type { MessageApi } from '#/api/message';

import { Page } from '@vben/common-ui';

import { Card, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getMessageLog, sendMessage } from '#/api/message';

const [BaseForm] = useVbenForm({
  handleSubmit: handleSendMsg,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入消息标题',
      },
      fieldName: 'title',
      label: '消息标题',
      rules: 'required',
    },
    {
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入消息内容',
      },
      fieldName: 'content',
      label: '消息内容',
      rules: 'required',
    },
  ],
});

const [ResultForm, resultFormApi] = useVbenForm({
  handleSubmit: handleGetMessageLog,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入消息流水号',
      },
      fieldName: 'msgId',
      label: '消息流水号',
      rules: 'required',
    },
    {
      component: 'Textarea',
      fieldName: 'sendResult',
      label: '发送结果',
      componentProps: {
        disabled: true,
      },
    },
  ],
});

function handleSendMsg(values: Record<string, any>) {
  sendMessage(values as MessageApi.SendMessageRequest).then((res) => {
    message.success(`消息发送成功：${res}`);
    resultFormApi.setValues({ msgId: res });
  });
}

function handleGetMessageLog(values: Record<string, any>) {
  getMessageLog(values.msgId).then((res) => {
    let sendResult = '';
    switch (res?.sendStatus) {
      case 0: {
        sendResult = '未发送';
        break;
      }
      case 1: {
        sendResult = '发送中';
        break;
      }
      case 2: {
        sendResult = '发送成功';
        break;
      }
      case 3: {
        sendResult = res.error || '发送失败';
        break;
      }
      default: {
        sendResult = '未知';
      }
    }
    resultFormApi.setValues({ sendResult });
  });
}
</script>

<template>
  <Page auto-content-height>
    <Card title="发送消息" class="mb-5">
      <BaseForm />
    </Card>
    <Card title="发送结果" class="">
      <ResultForm />
    </Card>
  </Page>
</template>

<style scoped lang="scss"></style>
