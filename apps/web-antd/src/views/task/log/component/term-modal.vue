<script setup lang="ts">
import { useVbenModal } from '@vben/common-ui';

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

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);

      // 创建一个 ResizeObserver 实例
      const resizeObserver = new ResizeObserver(() => {
        fitAddon.fit();
      });
      resizeObserver.observe(terminal);
    }

    // 旋转指示器相关变量
    const spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let spinnerInterval: NodeJS.Timeout | null = null;
    let spinnerIndex = 0;
    let isSpinning = false;

    // 启动旋转指示器
    const startSpinner = () => {
      if (isSpinning) return;

      isSpinning = true;
      spinnerIndex = 0;

      // 写入消息并保存光标位置
      term.write('\u001B[s');

      spinnerInterval = setInterval(() => {
        // 恢复光标位置
        term.write('\u001B[u');
        // 更新旋转指示器
        const char = spinnerChars[spinnerIndex];
        if (char) {
          term.write(`\u001B[1;33m${char}\u001B[0m`);
        }
        spinnerIndex = (spinnerIndex + 1) % spinnerChars.length;
      }, 150);
    };

    // 停止旋转指示器
    const stopSpinner = () => {
      if (!isSpinning) return;

      isSpinning = false;
      if (spinnerInterval) {
        clearInterval(spinnerInterval);
        spinnerInterval = null;
        // 清除旋转指示器并显示结果
        term.write('\u001B[u\u001B[K');
      }
    };

    const { action, content } = modalApi.getData();
    if (action === 'output') {
      content.split('\n').forEach((line: string) => term.writeln(`$ ${line}`));
    } else {
      // 隐藏光标
      term.write('\u001B[?25l');
      term.writeln('\u001B[1;32m开始执行任务...\r\n\u001B[0m');

      // 启动旋转指示器
      startSpinner();

      const eventSource = new EventSource('/api/task/execute/stream');
      eventSource.addEventListener('message', (e) => {
        // 停止旋转指示器
        stopSpinner();
        term.writeln(`$ ${e.data}`);
        // 重新启动旋转指示器
        startSpinner();
      });
      eventSource.addEventListener('error', (e) => {
        // 停止旋转指示器
        stopSpinner();
        if (e.data) {
          term.write(`\u001B[1;31m\r\n执行失败：${e.data}\u001B[0m\r\n`);
        }
        eventSource.close();
      });
      eventSource.addEventListener('result', () => {
        // 停止旋转指示器
        stopSpinner();
        term.writeln('\u001B[1;32m\r\n✔ 任务执行完成!\u001B[0m');
        eventSource.close();
      });
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
