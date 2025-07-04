<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';

import 'xterm/css/xterm.css';

const [Modal, modalApi] = useVbenModal({
  onOpened() {
    const term = new Terminal({
      disableStdin: true,
    });
    const terminal = document.querySelector('#terminal');
    if (terminal) {
      term.open(terminal as HTMLElement);
      term.writeln('Welcome to \u001B[1;32mEasy Service\u001B[0m.\n\r');
      const { action, content } = modalApi.getData();
      if (action === 'output') {
        content
          .split('\n')
          .forEach((line: string) => term.writeln(`$ ${line}`));
      } else {
        const eventSource = new EventSource('/api/task/execute/stream');
        eventSource.addEventListener('message', (e) => {
          term.writeln(`$ ${e.data}`);
        });
        eventSource.addEventListener('error', (e) => {
          console.log(e);
          if (e.data) {
            message.error(`执行失败：${e.data}`);
          }
          eventSource.close();
        });
        eventSource.addEventListener('result', (e) => {
          console.log(e.data);
          message.success('执行成功');
        });
      }
      // modalApi
      //   .getData()
      //   .split('\n')
      //   .forEach((line) => term.writeln(`$ ${line}`));

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      // 创建一个 ResizeObserver 实例
      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });
      resizeObserver.observe(terminal);

      // setTimeout(() => fitAddon.fit(), 20);
    }
  },
});
</script>

<template>
  <Modal>
    <div class="bg-black p-2">
      <div id="terminal"></div>
    </div>
  </Modal>
</template>

<style lang="scss" scoped>
.xterm-screen {
  width: 100%;
}
</style>
