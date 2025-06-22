<script setup lang="ts">
import type { CalendarMode } from 'ant-design-vue/es/calendar/generateCalendar';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Calendar } from 'ant-design-vue';
import { Dayjs } from 'dayjs';

import CalendarHeader from './calendar-header.vue';

const value = ref<Dayjs>();
const onPanelChange = (value: Dayjs | string, mode: CalendarMode) => {
  console.warn(value, mode);
};
</script>

<template>
  <Page auto-content-height>
    <div class="bg-background p-5">
      <Calendar v-model:value="value" @panel-change="onPanelChange">
        <template #headerRender="slotProps">
          <CalendarHeader :slot-props="slotProps" />
        </template>
      </Calendar>
    </div>
  </Page>
</template>
