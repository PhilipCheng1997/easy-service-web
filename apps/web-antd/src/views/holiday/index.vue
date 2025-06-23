<script setup lang="ts">
import { ref } from 'vue';

import { confirm, Page } from '@vben/common-ui';

import { Calendar, Tag } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

import { listCalendarData } from '#/api/calendar';
import { saveHoliday } from '#/api/holiday';

import CalendarHeader from './calendar-header.vue';

import { AntDesignCheckCircleFilled, AntDesignCloseCircleFilled, AntDesignClockCircleFilled } from "@vben/icons";

const calendarDataMap = ref<any>({});
const loadCalendarData = async (date: Dayjs = dayjs()) => {
  calendarDataMap.value = {};
  const startDate = date
    .subtract(1, 'month')
    .startOf('month')
    .format('YYYY-MM-DD');
  const endDate = date.add(1, 'month').endOf('month').format('YYYY-MM-DD');
  const calendarDataList = await listCalendarData({ startDate, endDate });
  for (const i in calendarDataList) {
    const calendarData = calendarDataList[i];
    if (!calendarDataMap.value[calendarData.date]) {
      calendarDataMap.value[calendarData.date] = [];
    }
    calendarDataMap.value[calendarData.date].push(calendarData);
  }
};
loadCalendarData();

const value = ref<Dayjs>();
const handleSelect = (value: Dayjs, { source }: any) => {
  if (source === 'customize') {
    loadCalendarData(value);
    return;
  }
  const date = value?.format('YYYY-MM-DD');
  const confirmContent = calendarDataMap.value[date]?.find(
    (item: any) => item.color === 'error',
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
</script>

<template>
  <Page auto-content-height>
    <div class="bg-background p-5">
      <Calendar v-model:value="value" @select="handleSelect">
        <template #headerRender="slotProps">
          <CalendarHeader :slot-props="slotProps" />
        </template>
        <template #dateCellRender="{ current }">
          <div v-if="calendarDataMap[current.format('YYYY-MM-DD')]">
            <Tag
              v-for="item in calendarDataMap[current.format('YYYY-MM-DD')]"
              class="mb-1 block"
              :color="item.color"
              :key="item.date"
            >
              <template #icon>
                <AntDesignCheckCircleFilled v-if="item.color === 'success'" />
                <AntDesignCloseCircleFilled v-if="item.color === 'error'" />
                <AntDesignClockCircleFilled v-if="item.color === 'warning'" />
              </template>
              {{ item.content }}
            </Tag>
          </div>
        </template>
      </Calendar>
    </div>
  </Page>
</template>
