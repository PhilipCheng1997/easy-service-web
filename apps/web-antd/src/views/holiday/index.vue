<script setup lang="ts">
import type { CalendarApi } from '#/api/calendar';

import { onMounted, ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';

import { Calendar } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

import { listCalendarData } from '#/api/calendar';
import { saveHoliday } from '#/api/holiday';

import CalendarHeader from './calendar-header.vue';
import DateCell from './date-cell.vue';

const calendarDataList = ref<Array<CalendarApi.CalendarData>>([]);
const loadCalendarData = (date: Dayjs = dayjs()) => {
  const startDate = date
    .subtract(1, 'month')
    .startOf('month')
    .format('YYYY-MM-DD');
  const endDate = date.add(1, 'month').endOf('month').format('YYYY-MM-DD');
  listCalendarData({ startDate, endDate }).then(
    (data) => (calendarDataList.value = data),
  );
};

const value = ref<Dayjs>();
const handleSelect = (value: Dayjs, { source }: any) => {
  if (source === 'customize') {
    loadCalendarData(value);
    return;
  }
  const date = value?.format('YYYY-MM-DD');
  const confirmContent = calendarDataList.value.some(
    (item: any) => item.color === 'error' && item.date === date,
  )
    ? `确定要删除休假日期${date}？`
    : `确定要指定日期${date}为休假日期？`;
  confirm({
    centered: false,
    content: confirmContent,
    icon: 'question',
  })
    .then(() => {
      saveHoliday(date).then(() => {
        loadCalendarData(value);
      });
    })
    .catch(() => {});
};

onMounted(() => {
  loadCalendarData();
});
</script>

<template>
  <Page auto-content-height>
    <div class="bg-background p-5 min-w-[800px]">
      <Calendar v-model:value="value" @select="handleSelect">
        <template #headerRender="slotProps">
          <CalendarHeader :slot-props="slotProps" />
        </template>
        <template #dateCellRender="{ current }">
          <DateCell :current="current" :calendar-data-list="calendarDataList" />
        </template>
      </Calendar>
    </div>
  </Page>
</template>
