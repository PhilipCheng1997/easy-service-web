<script setup lang="ts">
import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';

import { Calendar, Tag } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

import { listHoliday, saveHoliday } from '#/api/holiday';

import CalendarHeader from './calendar-header.vue';

const dates = ref<Array<string>>([]);
const loadHolidays = (date: Dayjs = dayjs()) => {
  const startDate = date
    .subtract(1, 'month')
    .startOf('month')
    .format('YYYY-MM-DD');
  const endDate = date.add(1, 'month').endOf('month').format('YYYY-MM-DD');
  listHoliday({ startDate, endDate }).then((data) => (dates.value = data));
};
loadHolidays();

const value = ref<Dayjs>();
const handleSelect = (value: Dayjs, { source }) => {
  if (source === 'customize') {
    loadHolidays(value)
    return;
  }
  const date = value?.format('YYYY-MM-DD');
  let confirmContent = '';
  confirmContent = dates.value.includes(date)
    ? `确定要删除休假日期${date}？`
    : `确定要指定日期${date}为休假日期？`;
  confirm({
    centered: false,
    content: confirmContent,
    icon: 'question',
  })
    .then(() => {
      saveHoliday(date).then(() => {
        loadHolidays(value);
      });
    })
    .catch(() => {});
};
</script>

<template>
  <Page auto-content-height>
    <div class="bg-background p-5">
      <Calendar v-model:value="value" @select="handleSelect">
        <template #headerRender="slotProps">
          <CalendarHeader :slot-props="slotProps" />
        </template>
        <template #dateCellRender="{ current }">
          <div class="flex justify-end">
            <Tag
              color="error"
              v-if="dates.includes(current.format('YYYY-MM-DD'))"
            >
              该日期不执行
            </Tag>
          </div>
        </template>
      </Calendar>
    </div>
  </Page>
</template>
