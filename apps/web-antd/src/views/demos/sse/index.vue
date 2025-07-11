<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Alert, Badge, Button, Card, Checkbox } from 'ant-design-vue';

import { startEvents } from '#/api/test';

type MessageType = 'error' | 'info' | 'success' | 'warning' | undefined;
interface Message {
  message: string;
  type: MessageType;
  time: string;
}

const messages = ref<Array<Message>>([]);
const eventSource = ref<EventSource>();
const hasError = ref<boolean>(false);
const pushing = ref<boolean>(false);

function handleConnect() {
  eventSource.value = new EventSource('/api/test/sse');

  eventSource.value.addEventListener('open', (e) => {
    console.log(e);
    logEvent('SSE connection opened', 'success');
  });

  eventSource.value.addEventListener('connected', (e) => {
    console.log(e);
    logEvent(e.data, 'success');
  });

  eventSource.value.addEventListener('update', (e) => {
    console.log(e);
    logEvent(e.data, 'info');
  });

  eventSource.value.addEventListener('end', (e) => {
    console.log(e);
    logEvent(`Stream completed: ${e.data}`, 'warning');
    doClose();
  });

  eventSource.value.addEventListener('error', (e: MessageEvent) => {
    console.log(e);
    if (eventSource.value?.readyState === EventSource.CLOSED) {
      logEvent('Connection closed', 'warning');
    } else {
      logEvent(e.data || '未知错误', 'error');
    }
    doClose();
  });
}

function logEvent(message: string, type: MessageType) {
  const time = new Date().toLocaleTimeString();
  messages.value.push({ message, type, time });
}

function handleDisconnect() {
  logEvent('Connection closed by user', 'warning');
  doClose();
}

function doClose() {
  if (eventSource.value) {
    eventSource.value.close();
    eventSource.value = undefined;
    pushing.value = false;
  }
}

function handleStartEvents() {
  startEvents(hasError.value).then(() => (pushing.value = true));
}
</script>

<template>
  <Page auto-content-height>
    <Card title="测试SSE" class="mb-5">
      <div class="mb-5">
        <span>当前状态：</span>
        <Badge v-if="eventSource" status="success" text="已连接" />
        <Badge v-else status="default" text="未连接" />
      </div>
      <div>
        <Checkbox v-model:checked="hasError">随机错误</Checkbox>
        <Button
          class="mr-2"
          type="primary"
          @click="handleConnect"
          :disabled="!!eventSource"
        >
          连接服务
        </Button>
        <Button
          class="mr-2"
          type="primary"
          :disabled="!eventSource || pushing"
          @click="handleStartEvents"
        >
          开始推送
        </Button>
        <Button danger @click="handleDisconnect" :disabled="!eventSource">
          断开连接
        </Button>
      </div>
    </Card>
    <Card title="输出结果">
      <template #extra>
        <Button type="link" @click="() => (messages = [])">清空</Button>
      </template>
      <Alert
        v-for="(msg, i) in messages"
        :key="i"
        :message="`[${msg.time}] ${msg.message}`"
        :type="msg.type"
        show-icon
      />
    </Card>
  </Page>
</template>

<style lang="scss" scoped>
.ant-alert {
  margin-bottom: 10px;
}
</style>
